import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/apiService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { Layers, Plus, Trash2, Save } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });
  const [toast, setToast] = useState(null);
  const [deleteCatId, setDeleteCatId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      if (res.data?.data) {
        setCategories(res.data.data);
      } else {
        setCategories([
          { id: '1', name: 'Technology', slug: 'technology', description: 'Tech & Software' },
          { id: '2', name: 'Design', slug: 'design', description: 'UI/UX Design' },
          { id: '3', name: 'Development', slug: 'development', description: 'Coding & Architecture' },
          { id: '4', name: 'Career Growth', slug: 'career-growth', description: 'Personal & Career Development' },
        ]);
      }
    } catch (err) {
      console.warn('Categories admin fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const generatedSlug = nameVal.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    setNewCat({ name: nameVal, slug: generatedSlug, description: newCat.description });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    try {
      const res = await adminApi.createCategory(newCat);
      const created = res.data?.data || res.data;
      setCategories((prev) => [...prev, created]);
      setShowCreateModal(false);
      setNewCat({ name: '', slug: '', description: '' });
      setToast({ type: 'success', message: 'Category created successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to create category' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCatId) return;
    const targetId = deleteCatId;
    setDeleteCatId(null);

    try {
      await adminApi.deleteCategory(targetId);
      setCategories((prev) => prev.filter((c) => c.id !== targetId));
      setToast({ type: 'success', message: 'Category deleted' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete category' });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={!!deleteCatId}
        title="Delete Category"
        message="Are you sure you want to delete this category? Associated articles may need category reassignment."
        confirmText="Delete Category"
        confirmVariant="btn-danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCatId(null)}
      />

      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '1rem',
        }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Create New Category</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCat.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Artificial Intelligence"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCat.slug}
                  onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  placeholder="Short description of this category..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminSidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2><Layers size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Category Administration</h2>

          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Create Category
          </button>
        </div>

        {loading ? (
          <Loading text="Loading categories..." />
        ) : (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Slug</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id || c.slug} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--primary)' }}>{c.slug}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.description || 'No description'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => setDeleteCatId(c.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCategories;
