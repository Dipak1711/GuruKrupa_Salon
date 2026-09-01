import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';
import { formatDateTime } from '../../utils/dates';
import { Modal } from '../common/Modal';
import {
  Users,
  Phone,
  Edit2,
  Trash2,
  DollarSign,
  User,
  AlertTriangle,
  Receipt,
  Scissors,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CustomerAggregated {
  name: string;
  phone: string;
  appointmentsCount: number;
  completedJobsCount: number;
  totalSpent: number;
  lastVisit: string;
  recordIds: string[];
  services: string[];
}

export const CustomerManager: React.FC = () => {
  const { currentRole } = useAuth();
  const { appointments, serviceRecords, activeBranchId, updateCustomer, deleteCustomer, updateServiceRecord } = useSalonData();
  const { success, error: toastError } = useToast();

  const isAdmin = currentRole === 'admin';

  // Modals state
  const [editingCustomer, setEditingCustomer] = useState<{ name: string; phone: string } | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<{ name: string; phone: string } | null>(null);
  const [expandedPhone, setExpandedPhone] = useState<string | null>(null);

  // Edit Service Record Modal state
  const [editingRecord, setEditingRecord] = useState<{
    id: string;
    customer_name: string;
    customer_phone: string;
    subtotal: number;
    discount: number;
    total_amount: number;
    payment_method: string;
    service_name: string;
  } | null>(null);

  // Edit Customer Form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Correct Price Form state
  const [recordSubtotal, setRecordSubtotal] = useState<number>(0);
  const [recordDiscount, setRecordDiscount] = useState<number>(0);
  const [recordName, setRecordName] = useState('');
  const [recordPhone, setRecordPhone] = useState('');
  const [recordPaymentMethod, setRecordPaymentMethod] = useState('UPI');

  // Filter service records strictly by active branch
  const branchRecords = serviceRecords.filter(
    (rec) => rec.branch_id === activeBranchId
  );

  // Aggregate customer database for active branch ONLY
  const customerMap: Record<string, CustomerAggregated> = {};

  branchRecords.forEach((rec) => {
    const rawName = (rec.customer_name || '').trim();
    const rawPhone = (rec.customer_phone || '').trim();

    // Skip disassociated/deleted customer entries
    if (!rawName && (!rawPhone || rawPhone === 'N/A')) return;
    if (rawName.toLowerCase() === 'deleted' || rawName.toLowerCase() === 'null') return;

    const key = rawPhone && rawPhone !== 'N/A' ? rawPhone : rawName;
    if (!key) return;

    if (!customerMap[key]) {
      customerMap[key] = {
        name: rawName || 'Walk-in Client',
        phone: rawPhone || 'N/A',
        appointmentsCount: 0,
        completedJobsCount: 0,
        totalSpent: 0,
        lastVisit: rec.completed_at,
        recordIds: [],
        services: [],
      };
    }
    customerMap[key].completedJobsCount += 1;
    customerMap[key].totalSpent += rec.total_amount;
    customerMap[key].recordIds.push(rec.id);
    rec.items.forEach((item) => {
      if (item.service_name && !customerMap[key].services.includes(item.service_name)) {
        customerMap[key].services.push(item.service_name);
      }
    });
  });

  const customerList = Object.values(customerMap);

  // Handlers for Edit Customer
  const handleOpenEditCustomer = (cust: { name: string; phone: string }) => {
    setEditingCustomer(cust);
    setEditName(cust.name);
    setEditPhone(cust.phone);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setIsSaving(true);
    try {
      await updateCustomer(editingCustomer.phone, editingCustomer.name, {
        name: editName,
        phone: editPhone,
      });
      success('Customer Updated', `Customer record for "${editName}" updated successfully across database.`);
      setEditingCustomer(null);
    } catch (err: any) {
      toastError('Update Failed', err?.message || 'Could not update customer record in Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Delete Customer
  const handleConfirmDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    setIsSaving(true);
    try {
      await deleteCustomer(deletingCustomer.phone, deletingCustomer.name);
      success('Customer Deleted', `Customer "${deletingCustomer.name}" deleted successfully.`);
      setDeletingCustomer(null);
    } catch (err: any) {
      toastError('Delete Failed', err?.message || 'Could not delete customer record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for Correcting Service Record Price
  const handleOpenEditRecord = (rec: any) => {
    setEditingRecord({
      id: rec.id,
      customer_name: rec.customer_name,
      customer_phone: rec.customer_phone,
      subtotal: rec.subtotal,
      discount: rec.discount,
      total_amount: rec.total_amount,
      payment_method: rec.payment?.payment_method || 'UPI',
      service_name: rec.items.map((i: any) => i.service_name).join(' + ') || 'Salon Service',
    });
    setRecordSubtotal(rec.subtotal);
    setRecordDiscount(rec.discount);
    setRecordName(rec.customer_name);
    setRecordPhone(rec.customer_phone);
    setRecordPaymentMethod(rec.payment?.payment_method || 'UPI');
  };

  const handleSaveServiceRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setIsSaving(true);
    try {
      const finalAmount = Math.max(0, recordSubtotal - recordDiscount);
      await updateServiceRecord(editingRecord.id, {
        subtotal: recordSubtotal,
        discount: recordDiscount,
        total_amount: finalAmount,
        customer_name: recordName,
        customer_phone: recordPhone,
        payment_method: recordPaymentMethod,
      });
      success('Price Corrected', `Service bill updated to ${formatPrice(finalTotalAmount(recordSubtotal, recordDiscount))}. Revenue & earnings updated.`);
      setEditingRecord(null);
    } catch (err: any) {
      toastError('Correction Failed', err?.message || 'Could not update service record.');
    } finally {
      setIsSaving(false);
    }
  };

  const finalTotalAmount = (sub: number, disc: number) => Math.max(0, sub - disc);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Client Relationship Registry
        </span>
        <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
          Customers Directory ({customerList.length})
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
          Registered clients and walk-in visitors with aggregated lifetime spend and visit counts.
        </p>
      </div>

      {/* Customers Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        {customerList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
            No customer records recorded yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Client</th>
                <th style={{ padding: '12px' }}>Phone Number</th>
                <th style={{ padding: '12px' }}>Bookings Requested</th>
                <th style={{ padding: '12px' }}>Completed Jobs</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total Lifetime Spend</th>
                {isAdmin && <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {customerList.map((client, idx) => {
                const isExpanded = expandedPhone === client.phone;
                const clientRecords = serviceRecords.filter(
                  (r) => (r.customer_phone || '').trim() === client.phone.trim() && r.branch_id === activeBranchId
                );

                return (
                  <React.Fragment key={idx}>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.88rem' }}>
                      <td style={{ padding: '14px', color: '#F8FAFC', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{client.name}</span>
                          {isAdmin && clientRecords.length > 0 && (
                            <button
                              onClick={() => setExpandedPhone(isExpanded ? null : client.phone)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#D4AF37',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              title="View/Correct Service History"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        {client.phone && client.phone !== 'N/A' ? (
                          <a
                            href={`tel:${client.phone}`}
                            style={{ color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Phone size={13} />
                            <span>{client.phone}</span>
                          </a>
                        ) : (
                          <span style={{ color: '#64748B' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '14px', color: '#CBD5E1' }}>
                        {client.appointmentsCount} requests
                      </td>
                      <td style={{ padding: '14px', color: '#F3E5AB' }}>
                        {client.completedJobsCount} services
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>
                        {formatPrice(client.totalSpent)}
                      </td>

                      {/* Admin-Only Actions */}
                      {isAdmin && (
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEditCustomer(client)}
                              className="btn-gold-outline"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', minHeight: '34px' }}
                              title="Edit Customer Info"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setDeletingCustomer(client)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#EF4444',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                minHeight: '34px',
                              }}
                              title="Delete Customer Record"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Services Taken & Form Filled Time Row for Admin Directory */}
                    {client.services.length > 0 && (
                      <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td colSpan={isAdmin ? 6 : 5} style={{ padding: '8px 14px 12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                              Services Taken:
                            </span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                              {client.services.map((srv, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    fontSize: '0.74rem',
                                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                    border: '1px solid rgba(212, 175, 55, 0.25)',
                                    color: '#F3E5AB',
                                    padding: '3px 9px',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                  }}
                                >
                                  {srv}
                                </span>
                              ))}
                            </div>
                            <span style={{ fontSize: '0.76rem', color: '#D4AF37', marginLeft: 'auto' }}>
                              Form Filled / Time: <strong>{formatDateTime(client.lastVisit)}</strong>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Expandable Service History & Price Correction Row for Admin */}
                    {isAdmin && isExpanded && clientRecords.length > 0 && (
                      <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                        <td colSpan={isAdmin ? 6 : 5} style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: '0.82rem', color: '#D4AF37', fontWeight: 600, marginBottom: '10px' }}>
                            Completed Service Records for {client.name} (Admin Price Correction)
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {clientRecords.map((rec) => (
                              <div
                                key={rec.id}
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                  border: '1px solid rgba(212, 175, 55, 0.2)',
                                  borderRadius: '10px',
                                  padding: '10px 14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontSize: '0.84rem',
                                }}
                              >
                                <div>
                                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>
                                    {rec.items.map((i) => i.service_name).join(' + ') || 'Salon Service'}
                                  </span>
                                  <span style={{ color: '#94A3B8', marginLeft: '12px', fontSize: '0.78rem' }}>
                                    Date: {formatDateTime(rec.completed_at)} • Stylist: {rec.employee_name || 'Stylist'}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <span style={{ color: '#10B981', fontWeight: 700 }}>
                                    {formatPrice(rec.total_amount)}
                                  </span>
                                  <button
                                    onClick={() => handleOpenEditRecord(rec)}
                                    className="btn-gold-outline"
                                    style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '30px' }}
                                  >
                                    <Receipt size={12} />
                                    <span>Correct Price</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 1. EDIT CUSTOMER MODAL (ADMIN ONLY)                                       */}
      {/* ------------------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(editingCustomer)}
        onClose={() => setEditingCustomer(null)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Edit2 size={20} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC' }}>
              Edit Customer Profile
            </span>
          </div>
        }
        subtitle={`Updating master customer record for ${editingCustomer?.name}`}
      >
        <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Customer Full Name *
            </label>
            <input
              type="text"
              className="salon-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              placeholder="e.g. Dipak Sonawane"
              style={{ width: '100%', padding: '10px 14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              className="salon-input"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              required
              placeholder="+91 9373738338"
              style={{ width: '100%', padding: '10px 14px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setEditingCustomer(null)}
              className="btn-gold-outline"
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-gold"
              style={{ padding: '10px 22px' }}
            >
              {isSaving ? 'Saving Updates...' : 'Save Customer Info'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. DELETE CUSTOMER CONFIRMATION MODAL (ADMIN ONLY)                        */}
      {/* ------------------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(deletingCustomer)}
        onClose={() => setDeletingCustomer(null)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} color="#EF4444" />
            <span className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC' }}>
              Delete Customer?
            </span>
          </div>
        }
        subtitle={`Action for ${deletingCustomer?.name}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6 }}>
            This will permanently delete this customer and all associated service and payment records. This action cannot be undone.
          </p>

          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.82rem',
              color: '#FCA5A5',
            }}
          >
            <strong>Warning:</strong> All linked service records, items, and payments will be permanently deleted from Supabase. Total salon revenue and stylist earnings will automatically recalculate.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => setDeletingCustomer(null)}
              className="btn-gold-outline"
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDeleteCustomer}
              disabled={isSaving}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isSaving ? 'Deleting...' : 'Delete Customer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------------------------------- */}
      {/* 3. CORRECT SERVICE PRICE MODAL (ADMIN ONLY)                               */}
      {/* ------------------------------------------------------------------------- */}
      <Modal
        isOpen={Boolean(editingRecord)}
        onClose={() => setEditingRecord(null)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={20} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.3rem', color: '#F8FAFC' }}>
              Admin Price Correction
            </span>
          </div>
        }
        subtitle={`Adjust service subtotal, discount, or payment info for ${editingRecord?.customer_name}`}
      >
        <form onSubmit={handleSaveServiceRecord} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>
              Service Name:
            </label>
            <strong style={{ color: '#F3E5AB', fontSize: '0.94rem' }}>{editingRecord?.service_name}</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Service Subtotal (₹) *
              </label>
              <input
                type="number"
                min="0"
                className="salon-input"
                value={recordSubtotal}
                onChange={(e) => setRecordSubtotal(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '10px 14px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Discount (₹)
              </label>
              <input
                type="number"
                min="0"
                className="salon-input"
                value={recordDiscount}
                onChange={(e) => setRecordDiscount(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 14px' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.86rem', color: '#94A3B8' }}>Corrected Net Total:</span>
            <strong style={{ fontSize: '1.2rem', color: '#10B981' }}>
              {formatPrice(finalTotalAmount(recordSubtotal, recordDiscount))}
            </strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Client Name
              </label>
              <input
                type="text"
                className="salon-input"
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Payment Method
              </label>
              <select
                className="salon-select"
                value={recordPaymentMethod}
                onChange={(e) => setRecordPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setEditingRecord(null)}
              className="btn-gold-outline"
              style={{ padding: '10px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-gold"
              style={{ padding: '10px 22px' }}
            >
              {isSaving ? 'Updating Record...' : 'Apply Price Correction'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
