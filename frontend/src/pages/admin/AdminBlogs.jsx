import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/apiService';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { FileText, Search, Trash2, Eye } from 'lucide-react';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteBlogId, setDeleteBlogId] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBlogs();
      if (res.data?.data) {
        setBlogs(res.data.data);
      } else {
        setBlogs([
          { id: '1', title: 'Building Scalable Spring Boot Services', authorName: 'Alex Morgan', category: 'Technology', status: 'PUBLISHED', createdAt: '2026-08-20', slug: 'building-scalable-spring-boot-services' },
          { id: '2', title: 'Modern UI Design Principles', authorName: 'Sarah Chen', category: 'Design', status: 'PUBLISHED', createdAt: '2026-08-19', slug: 'modern-ui-design-principles' },
          { id: '3', title: 'Building Modern React Components', authorName: 'David Miller', category: 'Development', status: 'DRAFT', createdAt: '2026-08-21', slug: 'building-modern-react-components' },
        ]);
      }
    } catch (err) {
      console.warn('Admin blogs fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteBlogId) return;
    const targetId = deleteBlogId;
    setDeleteBlogId(null);

    try {
      await adminApi.deleteBlog(targetId);
      setBlogs((prev) => prev.filter((b) => b.id !== targetId));
      setToast({ type: 'success', message: 'Article deleted by admin' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete blog article' });
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.authorName && b.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={!!deleteBlogId}
        title="Admin Delete Article"
        message="Are you sure you want to delete this blog post from the system? This action is permanent."
        confirmText="Delete Article"
        confirmVariant="btn-danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteBlogId(null)}
      />

      <AdminSidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2><FileText size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> System Blog Moderation</h2>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '130px', padding: '0.45rem' }}>
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="DRAFT">DRAFT</option>
            </select>

            <div className="input-with-icon" style={{ width: '220px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search title/author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
              <span className="input-toggle-btn"><Search size={14} /></span>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading text="Loading platform blogs..." />
        ) : (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Article Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Author</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Created Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{b.title}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{b.authorName || 'Author'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${b.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <Link to={`/blogs/${b.slug || b.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                          <Eye size={14} /> View
                        </Link>
                        <button onClick={() => setDeleteBlogId(b.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
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

export default AdminBlogs;
