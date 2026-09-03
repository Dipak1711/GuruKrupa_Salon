import React, { useState } from 'react';
import { useSalonData } from '../../context/SalonDataContext';
import { useToast } from '../../context/ToastContext';
import { Category } from '../../types';
import { Modal } from '../common/Modal';
import { Layers, Plus, Edit2, Eye, EyeOff, Scissors, Sparkles, CheckCircle2 } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, services, addCategory, updateCategory, toggleCategoryActive } = useSalonData();
  const { success, info } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Scissors');
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Scissors');
    setDisplayOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIcon(cat.icon || 'Scissors');
    setDisplayOrder(cat.display_order || 1);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        description,
        icon,
        display_order: Number(displayOrder),
      });
      success('Category Updated', `"${name}" updated successfully.`);
    } else {
      addCategory({
        name,
        description,
        icon,
        display_order: Number(displayOrder),
        is_active: true,
      });
      success('Category Created', `New taxonomy category "${name}" added.`);
    }

    setIsModalOpen(false);
  };

  const handleToggle = (catId: string, currentName: string) => {
    toggleCategoryActive(catId);
    info('Category Status Updated', `Status changed for "${currentName}".`);
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
            Taxonomy & Disciplines
          </span>
          <h2 className="font-serif" style={{ fontSize: '2.2rem', color: '#171717', fontWeight: 700 }}>
            Service Categories ({categories.length})
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#6F6A62', marginTop: '4px' }}>
            Categories organize dynamic services on the customer discovery home page.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-gold" style={{ padding: '11px 22px' }}>
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => {
          const catServices = services.filter((s) => s.category_id === cat.id);
          return (
            <div
              key={cat.id}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                opacity: cat.is_active ? 1 : 0.6,
                backgroundColor: '#FFFFFF',
                border: cat.is_active ? '1px solid #E4DED4' : '1px dashed #C94A4A',
                borderRadius: '18px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: '#F1EDE6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#C9A227',
                      }}
                    >
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#171717', fontWeight: 600 }}>
                        {cat.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#C9A227', fontWeight: 600 }}>
                        {catServices.length} Dynamic Services
                      </span>
                    </div>
                  </div>

                  {!cat.is_active && (
                    <span style={{ fontSize: '0.72rem', color: '#C94A4A', fontWeight: 600, backgroundColor: 'rgba(201, 74, 74, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                      Archived
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.86rem', color: '#6F6A62', lineHeight: 1.45, marginBottom: '14px' }}>
                  {cat.description}
                </p>

                <div style={{ borderTop: '1px solid #E4DED4', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Services in this Category:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {catServices.map((s) => (
                      <span
                        key={s.id}
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor: '#F1EDE6',
                          color: '#171717',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #E4DED4',
                        }}
                      >
                        {s.name} (₹{s.price})
                      </span>
                    ))}
                    {catServices.length === 0 && (
                      <span style={{ fontSize: '0.76rem', color: '#6F6A62' }}>No services assigned yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  borderTop: '1px solid #E4DED4',
                  paddingTop: '14px',
                }}
              >
                <button
                  onClick={() => handleToggle(cat.id, cat.name)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#F1EDE6',
                    border: '1px solid #E4DED4',
                    color: cat.is_active ? '#6F6A62' : '#16845B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {cat.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{cat.is_active ? 'Archive' : 'Restore'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="btn-gold-outline"
                  style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} color="#C9A227" />
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#171717' }}>
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add Service Category'}
            </span>
          </div>
        }
        subtitle="Manage dynamic category groupings for salon catalog."
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Category Name *
            </label>
            <input
              type="text"
              className="salon-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hair Care & Scissor Craft"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Description *
            </label>
            <textarea
              className="salon-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the services under this discipline..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Icon Reference
              </label>
              <input
                type="text"
                className="salon-input"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Scissors, Sparkles, Layers..."
              />
            </div>

            <div>
              <label style={{ fontSize: '0.84rem', color: '#6F6A62', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Display Order
              </label>
              <input
                type="number"
                min="1"
                className="salon-input"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
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

            <button type="submit" className="btn-gold" style={{ padding: '10px 22px' }}>
              <CheckCircle2 size={16} />
              <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
