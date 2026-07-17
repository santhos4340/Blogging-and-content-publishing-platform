import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi, blogApi } from '../api/apiService';
import Toast from '../components/Toast';
import { PenTool, ArrowLeft, Save, Send, Image as ImageIcon, Sparkles } from 'lucide-react';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    featuredImage: '',
    content: '',
  });

  const [categories, setCategories] = useState([
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Design', slug: 'design' },
    { id: '3', name: 'Development', slug: 'development' },
    { id: '4', name: 'Career Growth', slug: 'career-growth' },
  ]);

  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories from backend
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response.data && response.data.data && response.data.data.length > 0) {
          setCategories(response.data.data);
          setFormData((prev) => ({ ...prev, category: response.data.data[0].name }));
        }
      } catch (err) {
        console.warn('Using default fallback categories');
      }
    };
    fetchCategories();
  }, []);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: generatedSlug,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'featuredImage') setImagePreviewError(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Article title is required' });
      return false;
    }
    if (formData.title.trim().length < 5) {
      setToast({ type: 'error', message: 'Title must be at least 5 characters long' });
      return false;
    }
    if (formData.title.trim().length > 150) {
      setToast({ type: 'error', message: 'Title cannot exceed 150 characters' });
      return false;
    }
    if (!formData.content.trim()) {
      setToast({ type: 'error', message: 'Article content cannot be empty' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (targetStatus) => {
    if (!validate()) return;

    setSubmitting(true);
    setToast(null);

    const blogPayload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      excerpt: formData.excerpt.trim(),
      featuredImage: formData.featuredImage.trim(),
      content: formData.content.trim(),
      status: targetStatus,
    };

    try {
      const res = await blogApi.createBlog(blogPayload);
      const createdBlog = res.data?.data || res.data;
      
      setToast({
        type: 'success',
        message: targetStatus === 'PUBLISHED' ? 'Article published successfully!' : 'Saved as draft!',
      });

      setTimeout(() => {
        if (targetStatus === 'PUBLISHED' && createdBlog?.slug) {
          navigate(`/blogs/${createdBlog.slug}`);
        } else {
          navigate('/my-blogs');
        }
      }, 1000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || err.message || 'Failed to create blog' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PenTool size={22} color="var(--primary)" />
          <span>Write Article</span>
        </h2>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Article Title */}
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Master Spring Boot Architecture & Supabase Auth"
              className="form-input"
              value={formData.title}
              onChange={handleTitleChange}
              required
              disabled={submitting}
            />
          </div>

          {/* Slug & Category */}
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">URL Slug (Auto-generated)</label>
              <input
                type="text"
                name="slug"
                className="form-input"
                value={formData.slug}
                onChange={handleChange}
                placeholder="master-spring-boot-architecture"
                disabled={submitting}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
              >
                {categories.map((cat) => (
                  <option key={cat.id || cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image URL & Preview */}
          <div className="form-group">
            <label className="form-label">Featured Image URL (Optional)</label>
            <input
              type="url"
              name="featuredImage"
              className="form-input"
              placeholder="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
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
            {imagePreviewError && (
              <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.3rem' }}>
                Unable to load preview for this image URL. Image link will still be saved.
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label">Excerpt / Summary</label>
            <textarea
              name="excerpt"
              rows={2}
              className="form-textarea"
              placeholder="Brief summary displayed on blog feed cards..."
              value={formData.excerpt}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          {/* Body Content */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Article Content *</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Supports Markdown formatting</span>
            </div>
            <textarea
              name="content"
              rows={14}
              className="form-textarea"
              placeholder="Write your article content here..."
              value={formData.content}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleSubmit('DRAFT')}
              disabled={submitting}
            >
              <Save size={16} />
              <span>{submitting ? 'Saving...' : 'Save Draft'}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmit('PUBLISHED')}
              disabled={submitting}
            >
              <Send size={16} />
              <span>{submitting ? 'Publishing...' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
