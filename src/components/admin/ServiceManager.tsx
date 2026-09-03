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

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanImages = imageUrls.filter((url) => url.trim() !== '');
    const cleanBenefits = benefits.filter((b) => b.trim() !== '');

    let savedServiceId = editingService?.id;

    if (editingService) {
      updateService(editingService.id, {
        name,
        category_id: categoryId,
        price: Number(price),
        duration_mins: Number(durationMins),
        short_description: shortDesc,
        description,
        images: cleanImages.length > 0 ? cleanImages : [editingService.images[0]],
        benefits: cleanBenefits,
      });
      success('Service Updated', `"${name}" catalog details and pricing saved.`);
    } else {
      await addService({
        name,
        category_id: categoryId,
        price: Number(price),
        duration_mins: Number(durationMins),
        short_description: shortDesc,
        description,
        images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80'],
        benefits: cleanBenefits,
        is_active: true,
      });
      success('Service Created', `New service "${name}" added to salon menu.`);
    }

    // Sync assigned employees
    if (savedServiceId) {
      employees.forEach((emp) => {
        const isAssigned = assignedEmpIds.includes(emp.id);
        const hasService = emp.assigned_service_ids.includes(savedServiceId!);

        if (isAssigned && !hasService) {
          updateEmployee(emp.id, {
            assigned_service_ids: [...emp.assigned_service_ids, savedServiceId!],
          });
        } else if (!isAssigned && hasService) {
          updateEmployee(emp.id, {
            assigned_service_ids: emp.assigned_service_ids.filter((id) => id !== savedServiceId!),
          });
        }
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (srvId: string, srvName: string) => {
    toggleServiceActive(srvId);
    info('Service Status Updated', `Visibility changed for "${srvName}".`);
  };

  // Image Url helpers
  const handleAddImageUrlField = () => setImageUrls([...imageUrls, '']);
  const handleImageUrlChange = (idx: number, val: string) => {
    const updated = [...imageUrls];
    updated[idx] = val;
    setImageUrls(updated);
  };
  const handleRemoveImageUrlField = (idx: number) => {
    if (imageUrls.length > 1) setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  // Benefit helpers
  const handleAddBenefitField = () => setBenefits([...benefits, '']);
  const handleBenefitChange = (idx: number, val: string) => {
    const updated = [...benefits];
    updated[idx] = val;
    setBenefits(updated);
  };
  const handleRemoveBenefitField = (idx: number) => {
    if (benefits.length > 1) setBenefits(benefits.filter((_, i) => i !== idx));
  };

  // Employee Checkbox handler
  const handleEmpCheckboxChange = (empId: string) => {
    if (assignedEmpIds.includes(empId)) {
      setAssignedEmpIds(assignedEmpIds.filter((id) => id !== empId));
    } else {
      setAssignedEmpIds([...assignedEmpIds, empId]);
    }
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
          <span style={{ fontSize: '0.82rem', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Dynamic Catalog Control
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Service Management ({filteredServices.length} of {services.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
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
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4DED4',
          borderRadius: '16px',
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
          <Search size={16} color="#6F6A62" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
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
            color: '#6F6A62',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4DED4',
          }}
        >
          <Scissors size={36} color="#C9A227" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#171717', marginBottom: '4px' }}>No Services Found</h3>
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
                  backgroundColor: '#FFFFFF',
                  border: srv.is_active ? '1px solid #E4DED4' : '1px dashed #C94A4A',
                  borderRadius: '18px',
                }}
              >
                {/* Top Image & Info */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img
                    src={srv.images && srv.images[0] ? srv.images[0] : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'}
                    alt={srv.name}
                    style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E4DED4', flexShrink: 0 }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor: 'rgba(201, 162, 39, 0.12)',
                          color: '#9A7B1C',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontWeight: 600,
                        }}
                      >
                        {category?.name || 'General'}
                      </span>
                      {!srv.is_active && (
                        <span style={{ fontSize: '0.7rem', color: '#C94A4A', backgroundColor: 'rgba(201, 74, 74, 0.12)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          Archived
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif" style={{ fontSize: '1.2rem', color: '#171717', fontWeight: 600, marginBottom: '4px' }}>
                      {srv.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 700, color: '#C9A227', fontSize: '1.05rem' }}>
                        {formatPrice(srv.price)}
                      </span>
                      <span style={{ color: '#6F6A62', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={13} color="#C9A227" />
                        {srv.duration_mins}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description & Benefits */}
                <p style={{ fontSize: '0.84rem', color: '#6F6A62', lineHeight: 1.45, margin: 0 }}>
                  {srv.description || srv.short_description}
                </p>

                {/* Footer Metadata & Actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #E4DED4',
                    paddingTop: '12px',
                  }}
                >
                  <span style={{ fontSize: '0.76rem', color: '#6F6A62' }}>
                    Qualified Staff: <strong>{assignedCount} Stylists</strong>
                  </span>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleToggleActive(srv.id, srv.name)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: '#F1EDE6',
                        border: '1px solid #E4DED4',
                        color: srv.is_active ? '#6F6A62' : '#16845B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {srv.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{srv.is_active ? 'Archive' : 'Restore'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(srv)}
                      className="btn-gold"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      <Edit2 size={13} />
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
        maxWidth="xl"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scissors size={20} color="#C9A227" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#171717' }}>
              {editingService ? `Edit Service: ${editingService.name}` : 'Add New Salon Service'}
            </span>
          </div>
        }
        subtitle="Manage dynamic catalog pricing, durations, image gallery, and qualified craftsmen."
      >
        <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Service Title *
              </label>
              <input
                type="text"
                className="salon-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Gold Scissor Cut & Spa"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Category Taxonomy *
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Service Price (INR ₹) *
              </label>
              <input
                type="number"
                min="0"
                className="salon-input"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
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

          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Short Summary Description *
            </label>
            <input
              type="text"
              className="salon-input"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief 1-line hook for discovery cards"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Comprehensive Experience Details *
            </label>
            <textarea
              className="salon-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full service breakdown, consultation steps, product details..."
              required
            />
          </div>

          {/* Multi-Image URL Gallery Manager */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', fontWeight: 600 }}>
                Service Photography Gallery URLs (Slider Preview)
              </label>
              <button
                type="button"
                onClick={handleAddImageUrlField}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C9A227',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} />
                <span>Add Image URL</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {imageUrls.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="url"
                    className="salon-input"
                    value={url}
                    onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    required={idx === 0}
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrlField(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#C94A4A',
                        cursor: 'pointer',
                        padding: '6px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Key Benefits Checklist */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', fontWeight: 600 }}>
                What's Included & Key Benefits
              </label>
              <button
                type="button"
                onClick={handleAddBenefitField}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C9A227',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} />
                <span>Add Benefit</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {benefits.map((b, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="salon-input"
                    value={b}
                    onChange={(e) => handleBenefitChange(idx, e.target.value)}
                    placeholder="e.g. Free Scalp Massage & Hot Towel Treatment"
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefitField(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#C94A4A',
                        cursor: 'pointer',
                        padding: '6px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assign Skill to Craftsmen */}
          <div>
            <label style={{ fontSize: '0.84rem', color: '#171717', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Qualified Stylists Assigned to this Service ({assignedEmpIds.length} Selected)
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px',
                maxHeight: '160px',
                overflowY: 'auto',
                backgroundColor: '#F1EDE6',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #E4DED4',
              }}
            >
              {employees.map((emp) => {
                const isChecked = assignedEmpIds.includes(emp.id);
                return (
                  <label
                    key={emp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: isChecked ? '#171717' : '#6F6A62',
                      cursor: 'pointer',
                      fontWeight: isChecked ? 600 : 400,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleEmpCheckboxChange(emp.id)}
                      style={{ accentColor: '#C9A227' }}
                    />
                    <span>{emp.name} ({emp.role_title})</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #E4DED4',
              paddingTop: '16px',
            }}
          >
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-gold-outline" style={{ padding: '10px 18px' }}>
              Cancel
            </button>

            <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>
              <CheckCircle2 size={16} />
              <span>{editingService ? 'Save Service Catalog' : 'Publish Service'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
