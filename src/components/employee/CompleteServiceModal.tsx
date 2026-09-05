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
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#16845B" />
            <span className="font-serif" style={{ fontSize: '1.25rem', color: '#171717', fontWeight: 700 }}>
              {appointment ? `Complete: ${appointment.customer_name}` : 'Record Walk-in Client Service'}
            </span>
          </div>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Multi-Service Selector Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#171717', fontWeight: 600 }}>
                Services Performed ({selectedServices.length})
              </label>
            </div>

            {/* Add service dropdown */}
            <div style={{ marginBottom: '10px' }}>
              <select
                className="salon-select"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddService(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                style={{
                  minHeight: '46px',
                  fontSize: '0.88rem',
                  color: '#171717',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E4DED4',
                }}
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
            {selectedServices.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedServices.map((srv, idx) => (
                  <div
                    key={`${srv.id}-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#FAF8F5',
                      border: '1px solid #E4DED4',
                      borderRadius: '10px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.88rem', color: '#171717', fontWeight: 600 }}>
                        {srv.name}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: '#6F6A62', marginLeft: '6px' }}>
                        ({srv.duration_mins}m)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#9A7B1C' }}>
                        {formatPrice(srv.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceAtIndex(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#C94A4A',
                          cursor: 'pointer',
                          display: 'flex',
                          padding: '4px',
                          borderRadius: '4px',
                        }}
                        title="Remove service"
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
              backgroundColor: '#FAF8F5',
              border: '1px solid #E4DED4',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#6F6A62' }}>
              <span>Subtotal ({selectedServices.length} items):</span>
              <span style={{ fontWeight: 600, color: '#171717' }}>{formatPrice(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#6F6A62', fontWeight: 600 }}>Privilege Discount (₹):</span>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                style={{
                  width: '100px',
                  height: '38px',
                  textAlign: 'right',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E4DED4',
                  color: '#171717',
                  fontWeight: 700,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #E4DED4',
                paddingTop: '10px',
              }}
            >
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#171717' }}>
                Total:
              </span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#9A7B1C' }}>
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector — 4 Equal Mobile Columns */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#171717', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {(['UPI', 'Cash', 'Card', 'Other'] as PaymentMethod[]).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => handleSelectPaymentMethod(method)}
                    style={{
                      height: '84px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #C9A227' : '1px solid #E4DED4',
                      backgroundColor: isSelected ? '#FAF6E8' : '#FFFFFF',
                      color: isSelected ? '#9A7B1C' : '#171717',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      padding: '8px 4px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {method === 'UPI' && <QrCode size={22} color={isSelected ? '#C9A227' : '#6F6A62'} />}
                    {method === 'Cash' && <Banknote size={22} color={isSelected ? '#C9A227' : '#6F6A62'} />}
                    {method === 'Card' && <CreditCard size={22} color={isSelected ? '#C9A227' : '#6F6A62'} />}
                    {method === 'Other' && <DollarSign size={22} color={isSelected ? '#C9A227' : '#6F6A62'} />}
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
                backgroundColor: '#FAF6E8',
                border: '1px solid #D8C27D',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.88rem', color: '#171717', fontWeight: 700, display: 'block' }}>
                    UPI Payment
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#6F6A62', marginTop: '1px', display: 'block' }}>
                    {UPI_CONFIG.payeeName} • <strong>{UPI_CONFIG.upiId}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="btn-gold"
                style={{ width: '100%', minHeight: '44px', fontSize: '0.88rem', justifyContent: 'center' }}
              >
                <QrCode size={16} />
                <span>Generate UPI QR</span>
              </button>

              {/* Status Badge Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor:
                    paymentStatus === 'completed'
                      ? 'rgba(22, 132, 91, 0.12)'
                      : paymentStatus === 'cancelled'
                      ? 'rgba(201, 74, 74, 0.12)'
                      : 'rgba(183, 121, 31, 0.12)',
                  border:
                    paymentStatus === 'completed'
                      ? '1px solid rgba(22, 132, 91, 0.3)'
                      : paymentStatus === 'cancelled'
                      ? '1px solid rgba(201, 74, 74, 0.3)'
                      : '1px solid rgba(183, 121, 31, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {paymentStatus === 'completed' && <CheckCircle2 size={18} color="#16845B" />}
                  {paymentStatus === 'pending' && <Clock size={18} color="#B7791F" />}
                  {paymentStatus === 'cancelled' && <XCircle size={18} color="#C94A4A" />}
                  <span
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color:
                        paymentStatus === 'completed'
                          ? '#16845B'
                          : paymentStatus === 'cancelled'
                          ? '#C94A4A'
                          : '#B7791F',
                    }}
                  >
                    Payment Status: {paymentStatus.toUpperCase()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4DED4',
                    color: '#171717',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
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
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              borderTop: '1px solid #E4DED4',
              paddingTop: '14px',
              marginTop: '4px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-dark"
              style={{ minHeight: '48px', width: '100%', fontSize: '0.9rem' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValidToComplete}
              className={isFormValidToComplete ? 'btn-gold' : ''}
              style={{
                minHeight: '48px',
                width: '100%',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: isFormValidToComplete ? undefined : '#E4DED4',
                color: isFormValidToComplete ? '#171717' : '#8C857B',
                opacity: isFormValidToComplete ? 1 : 0.65,
                cursor: isFormValidToComplete ? 'pointer' : 'not-allowed',
              }}
            >
              <CheckCircle2 size={17} />
              <span>{isSubmitting ? 'Recording...' : `Complete Walk-in (${formatPrice(finalTotal)})`}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* SCAN & PAY MODAL */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <QrCode size={18} color="#C9A227" />
            <span className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 700 }}>
              SCAN & PAY
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: '#6F6A62', display: 'block' }}>
              {UPI_CONFIG.payeeName}
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#9A7B1C', marginTop: '1px' }}>
              {formatPrice(finalTotal)}
            </div>
          </div>

          {/* QR Code Container */}
          <div
            style={{
              padding: '12px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #C9A227',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 'min(65vw, 220px)',
              margin: '0 auto',
            }}
          >
            <img
              src={qrImageUrl}
              alt="GuruKrupa Salon UPI Payment QR Code"
              style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', display: 'block' }}
            />
            <span style={{ fontSize: '0.74rem', color: '#171717', fontWeight: 700, marginTop: '6px' }}>
              Scan with GPay, PhonePe, Paytm, BHIM or any UPI App
            </span>
          </div>

          {/* UPI ID & Copy Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#F1EDE6',
              border: '1px solid #E4DED4',
              padding: '8px 14px',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '300px',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: '#6F6A62' }}>
              UPI ID: <strong style={{ color: '#171717' }}>{UPI_CONFIG.upiId}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyUpiId}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9A7B1C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
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
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor:
                paymentStatus === 'completed'
                  ? 'rgba(22, 132, 91, 0.12)'
                  : paymentStatus === 'cancelled'
                  ? 'rgba(201, 74, 74, 0.12)'
                  : 'rgba(183, 121, 31, 0.12)',
              border:
                paymentStatus === 'completed'
                  ? '1px solid rgba(22, 132, 91, 0.3)'
                  : paymentStatus === 'cancelled'
                  ? '1px solid rgba(201, 74, 74, 0.3)'
                  : '1px solid rgba(183, 121, 31, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: paymentStatus === 'completed' ? '#16845B' : paymentStatus === 'cancelled' ? '#C94A4A' : '#B7791F' }}>
              STATUS: {paymentStatus.toUpperCase()}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button
              type="button"
              onClick={() => {
                setShowQrModal(false);
                setShowConfirmModal(true);
              }}
              className="btn-gold"
              style={{ width: '100%', minHeight: '44px', fontSize: '0.88rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={16} />
              <span>Payment Received</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setPaymentStatus('pending');
                  setShowQrModal(false);
                }}
                className="btn-dark"
                style={{ padding: '8px', minHeight: '40px', fontSize: '0.8rem', justifyContent: 'center' }}
              >
                <Clock size={15} />
                <span>Payment Not Received</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQrModal(false);
                  setShowCancelConfirmModal(true);
                }}
                style={{
                  backgroundColor: 'rgba(201, 74, 74, 0.1)',
                  border: '1px solid rgba(201, 74, 74, 0.3)',
                  color: '#C94A4A',
                  padding: '8px',
                  minHeight: '40px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <XCircle size={15} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={18} color="#16845B" />
            <span className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 700 }}>
              Confirm Payment
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: '#6F6A62', margin: 0 }}>
            Have you confirmed receipt in owner's UPI account?
          </p>

          <div
            style={{
              backgroundColor: '#FAF8F5',
              border: '1px solid #E4DED4',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.84rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6F6A62' }}>Amount:</span>
              <strong style={{ color: '#9A7B1C', fontSize: '0.96rem' }}>{formatPrice(finalTotal)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6F6A62' }}>UPI ID:</span>
              <strong style={{ color: '#171717' }}>{UPI_CONFIG.upiId}</strong>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#171717', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Bank UTR / Reference (Optional)
            </label>
            <input
              type="text"
              className="salon-input"
              value={bankUtrRef}
              onChange={(e) => setBankUtrRef(e.target.value)}
              placeholder="e.g. 123456789012"
              style={{ minHeight: '40px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => {
                setShowConfirmModal(false);
                setShowQrModal(true);
              }}
              className="btn-dark"
              style={{ padding: '8px 14px', minHeight: '40px', fontSize: '0.84rem' }}
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
              style={{ padding: '8px 16px', minHeight: '40px', fontSize: '0.84rem' }}
            >
              <CheckCircle2 size={15} />
              <span>Yes, Received</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={18} color="#C94A4A" />
            <span className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 700 }}>
              Cancel Payment
            </span>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: '#6F6A62', margin: 0 }}>
            Mark payment status as CANCELLED?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => {
                setShowCancelConfirmModal(false);
                setShowQrModal(true);
              }}
              className="btn-dark"
              style={{ padding: '8px 14px', minHeight: '40px', fontSize: '0.84rem' }}
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
                backgroundColor: '#C94A4A',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                minHeight: '40px',
              }}
            >
              <XCircle size={15} />
              <span>Yes, Cancel</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
