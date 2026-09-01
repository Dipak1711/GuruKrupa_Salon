import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Service, PaymentMethod, Appointment } from '../../types';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';
import { playLuxuryChime } from '../../utils/sound';
import { triggerBookingConfetti } from '../../utils/confetti';
import { CheckCircle2, DollarSign, Plus, Trash2, CreditCard, Banknote, QrCode, Search, UserCheck } from 'lucide-react';

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
  const { success, info } = useToast();

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingCustomers = useMemo(() => {
    const customerMap = new Map<string, { name: string; phone: string }>();

    serviceRecords.forEach((r) => {
      if (r.customer_phone && !customerMap.has(r.customer_phone)) {
        customerMap.set(r.customer_phone, { name: r.customer_name, phone: r.customer_phone });
      }
    });

    return Array.from(customerMap.values());
  }, [serviceRecords]);

  // Initialize from appointment if provided
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
    setTransactionRef('');
  }, [appointment, isOpen]);

  // Handle existing customer selection
  const handleSelectExistingCustomer = (phoneStr: string) => {
    const found = existingCustomers.find((c) => c.phone === phoneStr);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      info('Customer Loaded', `Loaded records for existing client: ${found.name}`);
    }
  };

  // Compute subtotal automatically from selected services
  const selectedServices = selectedServiceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as Service[];

  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const safeDiscount = Math.max(0, Math.min(subtotal, Number(discount) || 0));
  const finalTotal = Math.max(0, subtotal - safeDiscount);

  const handleAddService = (serviceId: string) => {
    if (serviceId) {
      setSelectedServiceIds((prev) => [...prev, serviceId]);
    }
  };

  const handleRemoveServiceAtIndex = (index: number) => {
    setSelectedServiceIds((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServiceIds.length === 0) {
      alert('Please select at least one service performed.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await completeService({
        appointmentId: appointment?.id || null,
        customerId: appointment?.customer_id || null,
        customerName: customerName || 'Walk-in Guest',
        customerPhone: customerPhone || 'N/A',
        employeeId,
        isWalkin: !appointment,
        selectedServiceIds,
        discount: safeDiscount,
        paymentMethod,
        transactionRef,
        notes,
      });

      playLuxuryChime('success');
      triggerBookingConfetti();
      success(
        appointment ? 'Appointment Service Completed!' : 'Walk-in Service Completed!',
        `Recorded ${formatPrice(finalTotal)} via ${paymentMethod}. Salon, employee earnings, and customer history updated.`
      );

      onClose();
      if (onCompleted) {
        onCompleted();
      }
    } catch (err) {
      console.error('Error completing walk-in service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
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
        {/* Walk-in Customer Search / Auto-fill (Prompt Requirement) */}
        {!appointment && existingCustomers.length > 0 && (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <label style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              🔍 Search Existing Salon Client (by Name or Phone)
            </label>
            <select
              className="salon-select"
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                handleSelectExistingCustomer(e.target.value);
              }}
            >
              <option value="">-- New Walk-in Client OR Select Existing Client --</option>
              {existingCustomers.map((c) => (
                <option key={c.phone} value={c.phone}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Customer Info Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Client Name *
            </label>
            <input
              type="text"
              className="salon-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Vikram Deshmukh"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Client Phone Number *
            </label>
            <input
              type="tel"
              className="salon-input"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+919876543210"
              required
            />
          </div>
        </div>

        {/* Multi-Service Selector Section (Financial Rule: Auto-calculation) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600 }}>
              Services Performed ({selectedServices.length})
            </label>
            <span style={{ fontSize: '0.78rem', color: '#D4AF37' }}>
              *Auto-calculated from service price database
            </span>
          </div>

          {/* Add another service dropdown */}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '8px' }}>
            {(['UPI', 'Cash', 'Card', 'Other'] as PaymentMethod[]).map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
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

        {/* Transaction Reference */}
        {paymentMethod !== 'Cash' && (
          <div>
            <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Transaction Ref / UPI UTR (Optional)
            </label>
            <input
              type="text"
              className="salon-input"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="e.g. UPI/1234567890 or POS Ref"
            />
          </div>
        )}

        {/* Service Notes */}
        <div>
          <label style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
            Service Completion Notes (Optional)
          </label>
          <input
            type="text"
            className="salon-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Low skin fade with hot towel eucalyptus shave"
          />
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '18px',
          }}
        >
          <button type="button" onClick={onClose} className="btn-dark" style={{ padding: '10px 18px' }}>
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || selectedServiceIds.length === 0}
            className="btn-gold"
            style={{ padding: '12px 24px', fontSize: '0.94rem', minHeight: '44px' }}
          >
            <CheckCircle2 size={17} />
            <span>{isSubmitting ? 'Recording...' : `Complete Walk-in (${formatPrice(finalTotal)})`}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
