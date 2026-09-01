import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { Service, Employee } from '../../types';
import { Modal } from '../common/Modal';
import { formatPrice } from '../../utils/currency';
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Clock,
  DollarSign,
  CheckCircle2,
  Layers,
  Users,
  Search,
  Filter,
} from 'lucide-react';

export const ServiceManager: React.FC = () => {
  const {
    services,
    categories,
    employees,
    addService,
    updateService,
    toggleServiceActive,
    updateEmployee,
  } = useSalonData();
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(350);
  const [durationMins, setDurationMins] = useState<number>(30);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [assignedEmpIds, setAssignedEmpIds] = useState<string[]>([]);

  // Filter services by search, category & status
  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'all' || srv.category_id === selectedCategoryFilter;
    const matchesStatus =
      selectedStatusFilter === 'all'
        ? true
        : selectedStatusFilter === 'active'
        ? srv.is_active
        : !srv.is_active;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setEditingService(null);
    setName('');
    setCategoryId(categories[0]?.id || '11111111-1111-1111-1111-111111111111');
    setPrice(350);
    setDurationMins(30);
    setShortDesc('');
    setDescription('');
    setImageUrls(['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80']);
    setBenefits(['Consultation & Hot Towel Treatment', 'Premium Imported Styling Product']);
    setAssignedEmpIds(employees.map((e) => e.id));
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setCategoryId(service.category_id);
    setPrice(service.price);
    setDurationMins(service.duration_mins);
    setShortDesc(service.short_description || service.description);
    setDescription(service.description);
    setImageUrls(service.images && service.images.length > 0 ? service.images : ['']);
    setBenefits(service.benefits && service.benefits.length > 0 ? service.benefits : ['']);

    const assigned = employees
      .filter((e) => e.assigned_service_ids.includes(service.id))
      .map((e) => e.id);
    setAssignedEmpIds(assigned);

    setIsModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanImages = imageUrls.filter((url) => url.trim().length > 0);
    const cleanBenefits = benefits.filter((b) => b.trim().length > 0);

    if (cleanImages.length === 0) {
      cleanImages.push('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80');
    }

    if (editingService) {
      updateService(editingService.id, {
        name,
        category_id: categoryId,
        price: Number(price),
        duration_mins: Number(durationMins),
        short_description: shortDesc,
        description,
        images: cleanImages,
        benefits: cleanBenefits,
      });

      employees.forEach((emp) => {
        const isAssigned = assignedEmpIds.includes(emp.id);
        const hasService = emp.assigned_service_ids.includes(editingService.id);

        if (isAssigned && !hasService) {
          updateEmployee(emp.id, {
            assigned_service_ids: [...emp.assigned_service_ids, editingService.id],
          });
        } else if (!isAssigned && hasService) {
          updateEmployee(emp.id, {
            assigned_service_ids: emp.assigned_service_ids.filter((id) => id !== editingService.id),
          });
        }
      });

      success('Service Updated', `"${name}" price updated to ${formatPrice(price)}. Customer discovery updated live.`);
    } else {
      const newServiceId = `a${Date.now()}`;
      addService({
        category_id: categoryId,
        name,
        short_description: shortDesc,
        description,
        price: Number(price),
        duration_mins: Number(durationMins),
        benefits: cleanBenefits,
        images: cleanImages,
        is_active: true,
      });

      employees.forEach((emp) => {
        if (assignedEmpIds.includes(emp.id)) {
          updateEmployee(emp.id, {
            assigned_service_ids: [...emp.assigned_service_ids, newServiceId],
          });
        }
      });

      success('Service Created', `New service "${name}" published at ${formatPrice(price)}.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (serviceId: string, currentName: string) => {
    toggleServiceActive(serviceId);
    info('Service Status Changed', `Status updated for "${currentName}".`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Dynamic Catalog Control
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#F8FAFC', fontWeight: 700 }}>
            Service Management ({filteredServices.length} of {services.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '4px' }}>
            Add, update prices, adjust durations, configure multi-image sliders, and archive/restore services dynamically.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="btn-gold" style={{ padding: '11px 22px' }}>
          <Plus size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search & Filters Controls Bar */}
      <div
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            className="salon-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name or description..."
            style={{ paddingLeft: '40px' }}
          />
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        {/* Category Filter */}
        <div style={{ width: '200px' }}>
          <select
            className="salon-select"
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ width: '170px' }}>
          <select
            className="salon-select"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '48px',
            textAlign: 'center',
            color: '#94A3B8',
          }}
        >
          <Scissors size={36} color="#D4AF37" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#F8FAFC', marginBottom: '4px' }}>No Services Found</h3>
          <p style={{ fontSize: '0.88rem' }}>Try clearing your search query or changing filters.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredServices.map((srv) => {
            const category = categories.find((c) => c.id === srv.category_id);
            const assignedCount = employees.filter((e) => e.assigned_service_ids.includes(srv.id)).length;

            return (
              <div
                key={srv.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  opacity: srv.is_active ? 1 : 0.6,
                  border: srv.is_active ? '1px solid rgba(212, 175, 55, 0.25)' : '1px dashed rgba(244, 63, 94, 0.35)',
                }}
              >
                {/* Top Image & Info */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img
                    src={srv.images && srv.images[0] ? srv.images[0] : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
                    alt={srv.name}
                    style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.3)', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor: 'rgba(212, 175, 55, 0.12)',
                          color: '#F3E5AB',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontWeight: 600,
                        }}
                      >
                        {category?.name || 'General'}
                      </span>
                      {!srv.is_active && (
                        <span style={{ fontSize: '0.7rem', color: '#FB7185', fontWeight: 600, backgroundColor: 'rgba(244, 63, 94, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                          Archived
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '4px' }}>
                      {srv.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#94A3B8', flexWrap: 'wrap' }}>
                      <span style={{ color: '#F3E5AB', fontWeight: 700, fontSize: '1.05rem' }}>
                        {formatPrice(srv.price)}
                      </span>
                      <span>•</span>
                      <span>{srv.duration_mins} mins</span>
                      <span>•</span>
                      <span>{srv.images ? srv.images.length : 1} Images</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: 1.4, margin: 0 }}>
                  {srv.short_description || srv.description}
                </p>

                {/* Actions Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '14px',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94A3B8' }}>
                    <Users size={14} color="#D4AF37" />
                    <span>{assignedCount} Stylists Assigned</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleActive(srv.id, srv.name)}
                      title={srv.is_active ? 'Archive Service' : 'Restore Service'}
                      style={{
                        padding: '7px 12px',
                        minHeight: '44px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: srv.is_active ? '#94A3B8' : '#10B981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                      }}
                    >
                      {srv.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                      <span>{srv.is_active ? 'Archive' : 'Restore'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(srv)}
                      className="btn-gold-outline"
                      style={{ padding: '7px 14px', fontSize: '0.82rem', minHeight: '44px' }}
                    >
                      <Edit2 size={14} />
                      <span>Edit Service</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="2xl"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scissors size={20} color="#D4AF37" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC' }}>
              {editingService ? `Edit Service: ${editingService.name}` : 'Add New Salon Service'}
            </span>
          </div>
        }
        subtitle="Changes reflect dynamically across customer booking catalog in real time."
      >
        <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Service Name & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Service Name *
              </label>
              <input
                type="text"
                className="salon-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Signature Haircut"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                className="salon-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Price in INR (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                className="salon-input"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min="5"
                step="5"
                className="salon-input"
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Short Card Description *
            </label>
            <input
              type="text"
              className="salon-input"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="e.g. Precision scissor & clipper cut tailored to face architecture."
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Full Experience Description *
            </label>
            <textarea
              className="salon-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed step-by-step description for the service detail modal..."
              required
            />
          </div>

          {/* Multiple Image URLs Manager */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600 }}>
                Showcase Images ({imageUrls.length})
              </label>
              <button
                type="button"
                onClick={() => setImageUrls([...imageUrls, ''])}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#D4AF37',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add Image URL
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {imageUrls.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="url"
                    className="salon-input"
                    value={url}
                    onChange={(e) => {
                      const updated = [...imageUrls];
                      updated[idx] = e.target.value;
                      setImageUrls(updated);
                    }}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                      style={{ background: 'transparent', border: 'none', color: '#FB7185', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600 }}>
                Inclusions & Key Benefits ({benefits.length})
              </label>
              <button
                type="button"
                onClick={() => setBenefits([...benefits, ''])}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#D4AF37',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Add Benefit Point
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {benefits.map((b, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="salon-input"
                    value={b}
                    onChange={(e) => {
                      const updated = [...benefits];
                      updated[idx] = e.target.value;
                      setBenefits(updated);
                    }}
                    placeholder="e.g. Organic argan oil steam rinse"
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                      style={{ background: 'transparent', border: 'none', color: '#FB7185', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assign Stylists Matrix */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Assign Capable Master Stylists
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {employees
                .filter((e) => e.is_active)
                .map((emp) => {
                  const isChecked = assignedEmpIds.includes(emp.id);
                  return (
                    <label
                      key={emp.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: isChecked ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: isChecked ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssignedEmpIds([...assignedEmpIds, emp.id]);
                          } else {
                            setAssignedEmpIds(assignedEmpIds.filter((id) => id !== emp.id));
                          }
                        }}
                      />
                      <img
                        src={emp.avatar_url}
                        alt={emp.name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.84rem', color: isChecked ? '#F3E5AB' : '#CBD5E1', fontWeight: 500 }}>
                        {emp.name}
                      </span>
                    </label>
                  );
                })}
            </div>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '18px',
            }}
          >
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-dark" style={{ padding: '10px 20px' }}>
              Cancel
            </button>

            <button type="submit" className="btn-gold" style={{ padding: '11px 26px', minHeight: '44px' }}>
              <CheckCircle2 size={16} />
              <span>{editingService ? 'Save Changes' : 'Create & Publish Service'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
