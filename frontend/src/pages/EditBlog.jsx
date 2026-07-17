import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi, categoryApi } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { PenTool, ArrowLeft, Save, Send, Trash2, Image as ImageIcon } from 'lucide-react';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    featuredImage: '',
    content: '',
    status: 'DRAFT',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadBlogAndCategories = async () => {
      setLoading(true);
      try {
        const [catsRes, blogRes] = await Promise.all([
          categoryApi.getCategories().catch(() => null),
          blogApi.getBlogById(id),
        ]);

        if (catsRes?.data?.data) {
          setCategories(catsRes.data.data);
        }

        const b = blogRes.data?.data || blogRes.data;
        if (b) {
          setFormData({
            title: b.title || '',
            slug: b.slug || '',
            category: b.category || 'Technology',
            excerpt: b.excerpt || '',
            featuredImage: b.featuredImage || '',
            content: b.content || '',
            status: b.status || 'DRAFT',
          });
        }
      } catch (err) {
        setToast({ type: 'error', message: 'Failed to load article details.' });
      } finally {
        setLoading(false);
      }
    };

    loadBlogAndCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'featuredImage') setImagePreviewError(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (targetStatus) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setToast({ type: 'error', message: 'Title and content are required' });
      return;
    }

    setSubmitting(true);
    setToast(null);

    const updatePayload = {
      ...formData,
      status: targetStatus,
    };

    try {
      await blogApi.updateBlog(id, updatePayload);
      setToast({ type: 'success', message: 'Article updated successfully!' });
      setTimeout(() => {
        navigate('/my-blogs');
      }, 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Update failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    setSubmitting(true);
    try {
      await blogApi.deleteBlog(id);
      setToast({ type: 'success', message: 'Article deleted successfully' });
      setTimeout(() => {
        navigate('/my-blogs');
      }, 800);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Delete failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading article editor..." />;
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Article"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete Article"
        confirmVariant="btn-danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/my-blogs')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <Trash2 size={16} />
            <span>Delete Article</span>
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PenTool size={22} color="var(--primary)" />
          <span>Edit Article</span>
        </h2>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Article Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                name="slug"
                className="form-input"
                value={formData.slug}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} disabled={submitting}>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Career Growth">Career Growth</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Featured Image URL</label>
            <input
              type="url"
              name="featuredImage"
              className="form-input"
              value={formData.featuredImage}
              onChange={handleChange}
              disabled={submitting}
            />
            {formData.featuredImage && !imagePreviewError && (
              <div style={{ marginTop: '0.75rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '200px', border: '1px solid var(--border-color)' }}>
                <img
                  src={formData.featuredImage}
                  alt="Featured Preview"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt</label>
            <textarea
              name="excerpt"
              rows={2}
              className="form-textarea"
              value={formData.excerpt}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Article Content</label>
            <textarea
              name="content"
              rows={14}
              className="form-textarea"
              value={formData.content}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleUpdate('DRAFT')}
              disabled={submitting}
            >
              <Save size={16} />
              <span>{submitting ? 'Saving...' : 'Save Draft'}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleUpdate('PUBLISHED')}
              disabled={submitting}
            >
              <Send size={16} />
              <span>{submitting ? 'Publishing...' : 'Save & Publish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
