import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Service, PaymentMethod, Appointment } from '../../types';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';
import { playLuxuryChime } from '../../utils/sound';
import { triggerBookingConfetti } from '../../utils/confetti';
import {
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  Search,
  UserCheck,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Smartphone,
  Copy,
  RefreshCw,
} from 'lucide-react';

export const UPI_CONFIG = {
  upiId: '9322266019@ybl',
  payeeName: 'GuruKrupa SALON',
};

interface CompleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  employeeId: string;
  onCompleted?: () => void;
}

export const CompleteServiceModal: React.FC<CompleteServiceModalProps> = ({
  isOpen,
  onClose,
  appointment,
  employeeId,
  onCompleted,
}) => {
  const { services, appointments, serviceRecords, completeService } = useSalonData();
  const { success, info, error: toastError } = useToast();

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending');
  const [bankUtrRef, setBankUtrRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separate dialog states
  const [showQrModal, setShowQrModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  const existingCustomers = useMemo(() => {
    const customerMap = new Map<string, { name: string; phone: string }>();
    serviceRecords.forEach((r) => {
      if (r.customer_phone && !customerMap.has(r.customer_phone)) {
        customerMap.set(r.customer_phone, { name: r.customer_name, phone: r.customer_phone });
      }
    });
    return Array.from(customerMap.values());
  }, [serviceRecords]);

  // Reset state when modal opens or appointment changes
  useEffect(() => {
    if (appointment) {
      setCustomerName(appointment.customer_name);
      setCustomerPhone(appointment.customer_phone);
      setSelectedServiceIds(appointment.service_id ? [appointment.service_id] : []);
      setNotes(appointment.notes || '');
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setSelectedServiceIds([]);
      setNotes('');
    }
    setCustomerSearch('');
    setDiscount(0);
    setPaymentMethod('UPI');
    setPaymentStatus('pending');
    setBankUtrRef('');
    setShowQrModal(false);
    setShowConfirmModal(false);
    setShowCancelConfirmModal(false);
  }, [appointment, isOpen]);

  // Auto-set default status based on payment method
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'UPI') {
      setPaymentStatus('pending');
    } else if (method === 'Cash') {
      setPaymentStatus('completed');
    } else {
      setPaymentStatus('pending');
    }
  };

  // Compute subtotal & final total
  const selectedServices = selectedServiceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as Service[];

  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const safeDiscount = Math.max(0, Math.min(subtotal, Number(discount) || 0));
  const finalTotal = Math.max(0, subtotal - safeDiscount);

  // Invalidate payment status if total amount changes after payment was marked completed
  useEffect(() => {
    if (paymentMethod === 'UPI' && paymentStatus === 'completed') {
      setPaymentStatus('pending');
      info('Amount Changed', 'Total service amount updated. Please verify and complete payment for the new amount.');
    }
  }, [finalTotal]);

  // Construct safe, standard NPCI-compliant UPI URI using URLSearchParams
  const upiUri = useMemo(() => {
    const params = new URLSearchParams();
    params.set('pa', UPI_CONFIG.upiId.trim());
    params.set('pn', UPI_CONFIG.payeeName.trim());
    params.set('am', finalTotal.toFixed(2));
    params.set('cu', 'INR');
    params.set('tn', 'Salon Service Payment');
    return `upi://pay?${params.toString()}`;
  }, [finalTotal]);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  // Generate unique internal attempt reference for audit trail
  const internalTxnRef = useMemo(() => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(100000 + Math.random() * 900000);
    return `GKS-${dateStr}-${randNum}`;
  }, [selectedServiceIds, finalTotal]);

  // Clipboard copy fallback
  const handleCopyUpiId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_CONFIG.upiId);
      success('UPI ID Copied', `Copied ${UPI_CONFIG.upiId} to clipboard!`);
    } else {
      info('UPI ID', UPI_CONFIG.upiId);
    }
  };

  const handleAddService = (serviceId: string) => {
    if (serviceId) {
      setSelectedServiceIds((prev) => [...prev, serviceId]);
    }
  };

  const handleRemoveServiceAtIndex = (index: number) => {
    setSelectedServiceIds((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit complete walk-in service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServiceIds.length === 0) {
      alert('Please select at least one service performed.');
      return;
    }

    if (paymentMethod === 'UPI' && paymentStatus !== 'completed') {
      toastError('Payment Pending', 'You must verify and mark UPI payment COMPLETED before finalizing the walk-in service.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await completeService({
        appointmentId: appointment?.id || null,
        customerId: appointment?.customer_id || null,
        customerName: customerName || 'Walk-in Guest',
        customerPhone: customerPhone || 'N/A',
        employeeId,
        isWalkin: !appointment,
        selectedServiceIds,
        discount: safeDiscount,
        paymentMethod,
        paymentStatus,
        transactionRef: bankUtrRef ? bankUtrRef.trim() : internalTxnRef,
        notes,
      });

      playLuxuryChime('success');
      triggerBookingConfetti();
      success(
        appointment ? 'Appointment Service Completed!' : 'Walk-in Service Completed!',
        `Recorded ${formatPrice(finalTotal)} via ${paymentMethod} (${paymentStatus.toUpperCase()}). Salon & employee metrics updated.`
      );

      onClose();
      if (onCompleted) {
        onCompleted();
      }
    } catch (err: any) {
      console.error('Error completing walk-in service:', err);
      alert(err?.message || 'Error saving walk-in service record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValidToComplete = selectedServiceIds.length > 0 && (paymentMethod !== 'UPI' || paymentStatus === 'completed') && !isSubmitting;

  return (
    <>
      <Modal
        isOpen={isOpen && !showQrModal && !showConfirmModal && !showCancelConfirmModal}
        onClose={onClose}
        maxWidth="xl"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC' }}>
              {appointment ? `Complete Service: ${appointment.customer_name}` : 'Record Walk-in Client Service'}
            </span>
          </div>
        }
        subtitle={
          appointment
            ? `Completing appointment request for ${appointment.customer_name}`
            : 'Record walk-in guest services, payment, and auto-calculate totals'
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Multi-Service Selector Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600 }}>
                Services Performed ({selectedServices.length})
              </label>
              <span style={{ fontSize: '0.78rem', color: '#D4AF37' }}>
                *Auto-calculated from service price database
              </span>
            </div>

            {/* Add service dropdown */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <select
                className="salon-select"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddService(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  + Add Performed Service (Haircut, Beard, Shave, Spa...)
                </option>
                {services
                  .filter((s) => s.is_active)
                  .map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} — {formatPrice(srv.price)} ({srv.duration_mins}m)
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected services list */}
            {selectedServices.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#94A3B8',
                  fontSize: '0.86rem',
                }}
              >
                No services selected yet. Use the dropdown above to add services (e.g. Haircut + Shave).
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedServices.map((srv, idx) => (
                  <div
                    key={`${srv.id}-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#F8FAFC', fontWeight: 500 }}>
                        {srv.name}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginLeft: '10px' }}>
                        ({srv.duration_mins} mins)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '0.96rem', fontWeight: 600, color: '#F3E5AB' }}>
                        {formatPrice(srv.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceAtIndex(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#FB7185',
                          cursor: 'pointer',
                          display: 'flex',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Auto-Calculation Box */}
          <div
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#CBD5E1' }}>
              <span>Subtotal ({selectedServices.length} items):</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>Privilege Discount (₹):</span>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                style={{
                  width: '100px',
                  textAlign: 'right',
                  backgroundColor: 'rgba(12, 15, 21, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F8FAFC',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                paddingTop: '10px',
                marginTop: '4px',
              }}
            >
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC' }}>
                Final Net Total:
              </span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F3E5AB' }}>
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {(['UPI', 'Cash', 'Card', 'Other'] as PaymentMethod[]).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => handleSelectPaymentMethod(method)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: isSelected ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#F3E5AB' : '#94A3B8',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {method === 'UPI' && <QrCode size={18} />}
                    {method === 'Cash' && <Banknote size={18} />}
                    {method === 'Card' && <CreditCard size={18} />}
                    {method === 'Other' && <DollarSign size={18} />}
                    <span>{method}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* UPI Generate QR Button & Status Panel */}
          {paymentMethod === 'UPI' && (
            <div
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#F3E5AB', fontWeight: 600, display: 'block' }}>
                    Free Direct UPI Payment (Owner Account)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    UPI ID: {UPI_CONFIG.upiId} | Payee: {UPI_CONFIG.payeeName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  <QrCode size={16} />
                  <span>Generate UPI QR</span>
                </button>
              </div>

              {/* Status Badge Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor:
                    paymentStatus === 'completed'
                      ? 'rgba(16, 185, 129, 0.12)'
                      : paymentStatus === 'cancelled'
                      ? 'rgba(244, 63, 94, 0.12)'
                      : 'rgba(245, 158, 11, 0.12)',
                  border:
                    paymentStatus === 'completed'
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : paymentStatus === 'cancelled'
                      ? '1px solid rgba(244, 63, 94, 0.3)'
                      : '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {paymentStatus === 'completed' && <CheckCircle2 size={18} color="#10B981" />}
                  {paymentStatus === 'pending' && <Clock size={18} color="#F59E0B" />}
                  {paymentStatus === 'cancelled' && <XCircle size={18} color="#F43F5E" />}
                  <div>
                    <span
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color:
                          paymentStatus === 'completed'
                            ? '#10B981'
                            : paymentStatus === 'cancelled'
                            ? '#F43F5E'
                            : '#F59E0B',
                      }}
                    >
                      Payment Status: {paymentStatus.toUpperCase()}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8' }}>
                      {paymentStatus === 'completed'
                        ? 'Payment verified in owner UPI bank app.'
                        : paymentStatus === 'cancelled'
                        ? 'Payment marked cancelled.'
                        : 'Manual verification required before completing walk-in.'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#F8FAFC',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Verify / Change
                </button>
              </div>
            </div>
          )}

          {/* Complete Walk-in Actions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '18px',
            }}
          >
            {paymentMethod === 'UPI' && paymentStatus !== 'completed' && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                }}
              >
                <AlertTriangle size={14} />
                <span>Complete Walk-in is disabled until payment status is COMPLETED.</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={onClose} className="btn-dark" style={{ padding: '10px 18px' }}>
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValidToComplete}
                className="btn-gold"
                style={{
                  padding: '12px 24px',
                  fontSize: '0.94rem',
                  minHeight: '44px',
                  opacity: isFormValidToComplete ? 1 : 0.4,
                  cursor: isFormValidToComplete ? 'pointer' : 'not-allowed',
                }}
              >
                <CheckCircle2 size={17} />
                <span>{isSubmitting ? 'Recording...' : `Complete Walk-in (${formatPrice(finalTotal)})`}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* SCAN & PAY MODAL */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={20} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC' }}>
              SCAN & PAY
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '0.86rem', color: '#94A3B8', display: 'block' }}>
              {UPI_CONFIG.payeeName}
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F3E5AB', marginTop: '2px' }}>
              {formatPrice(finalTotal)}
            </div>
          </div>

          {/* QR Code Container */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              border: '3px solid #D4AF37',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={qrImageUrl}
              alt="GuruKrupa Salon UPI Payment QR Code"
              style={{ width: '220px', height: '220px', display: 'block' }}
            />
            <span style={{ fontSize: '0.78rem', color: '#0F172A', fontWeight: 700, marginTop: '8px' }}>
              Scan with GPay, PhonePe, Paytm, BHIM or any UPI App
            </span>
          </div>

          {/* UPI ID & Copy Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '320px',
            }}
          >
            <span style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>
              UPI ID: <strong style={{ color: '#F8FAFC' }}>{UPI_CONFIG.upiId}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyUpiId}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#D4AF37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <Copy size={14} />
              <span>Copy</span>
            </button>
          </div>

          {/* Current Status Display */}
          <div
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor:
                paymentStatus === 'completed'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : paymentStatus === 'cancelled'
                  ? 'rgba(244, 63, 94, 0.12)'
                  : 'rgba(245, 158, 11, 0.12)',
              border:
                paymentStatus === 'completed'
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : paymentStatus === 'cancelled'
                  ? '1px solid rgba(244, 63, 94, 0.3)'
                  : '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentStatus === 'completed' ? '#10B981' : paymentStatus === 'cancelled' ? '#F43F5E' : '#F59E0B' }}>
              STATUS: {paymentStatus.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '2px' }}>
              {paymentStatus === 'completed'
                ? 'Payment verified in owner bank/UPI app.'
                : paymentStatus === 'cancelled'
                ? 'Payment marked cancelled.'
                : 'Payment has not been manually verified yet.'}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => {
                setShowQrModal(false);
                setShowConfirmModal(true);
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={18} />
              <span>Payment Received</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setPaymentStatus('pending');
                  setShowQrModal(false);
                }}
                className="btn-dark"
                style={{ padding: '10px', fontSize: '0.84rem', justifyContent: 'center' }}
              >
                <Clock size={16} />
                <span>Payment Not Received</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQrModal(false);
                  setShowCancelConfirmModal(true);
                }}
                style={{
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#FB7185',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
              >
                <XCircle size={16} />
                <span>Cancel Payment</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* CONFIRM PAYMENT MODAL */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        maxWidth="sm"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#10B981" />
            <span className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC' }}>
              Confirm Payment
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
            Have you checked the owner's UPI/bank account and confirmed that the exact amount has been received?
          </p>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.86rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Expected Amount:</span>
              <strong style={{ color: '#F3E5AB', fontSize: '1rem' }}>{formatPrice(finalTotal)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Payment Method:</span>
              <strong style={{ color: '#F8FAFC' }}>UPI</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>UPI Account:</span>
              <strong style={{ color: '#F8FAFC' }}>{UPI_CONFIG.upiId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Internal Ref:</span>
              <span style={{ color: '#CBD5E1', fontSize: '0.78rem', fontFamily: 'monospace' }}>{internalTxnRef}</span>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Actual UPI Reference / Bank UTR (Optional)
            </label>
            <input
              type="text"
              className="salon-input"
              value={bankUtrRef}
              onChange={(e) => setBankUtrRef(e.target.value)}
              placeholder="e.g. 123456789012"
            />
          </div>

          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '0.82rem',
              color: '#F59E0B',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Warning:</strong> Only continue if the exact amount of <strong>{formatPrice(finalTotal)}</strong> has actually been received in the salon owner's account.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setShowConfirmModal(false);
                setShowQrModal(true);
              }}
              className="btn-dark"
              style={{ padding: '10px 16px' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentStatus('completed');
                setShowConfirmModal(false);
                success('Payment Verified', `Marked UPI payment of ${formatPrice(finalTotal)} as COMPLETED.`);
              }}
              className="btn-gold"
              style={{ padding: '10px 18px' }}
            >
              <CheckCircle2 size={16} />
              <span>Yes, Payment Received</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRM CANCELLATION MODAL */}
      <Modal
        isOpen={showCancelConfirmModal}
        onClose={() => setShowCancelConfirmModal(false)}
        maxWidth="sm"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={20} color="#F43F5E" />
            <span className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC' }}>
              Confirm Payment Cancellation
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0 }}>
            Are you sure the payment was not completed?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setShowCancelConfirmModal(false);
                setShowQrModal(true);
              }}
              className="btn-dark"
              style={{ padding: '10px 16px' }}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentStatus('cancelled');
                setShowCancelConfirmModal(false);
                info('Payment Cancelled', 'Marked UPI payment status as CANCELLED.');
              }}
              style={{
                backgroundColor: '#F43F5E',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <XCircle size={16} />
              <span>Yes, Cancel Payment</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
