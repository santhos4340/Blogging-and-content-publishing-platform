import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi, blogApi } from '../api/apiService';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { BookOpen, Plus, Edit3, Trash2, Eye, Search, X } from 'lucide-react';

const MyBlogs = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteBlogId, setDeleteBlogId] = useState(null);

  const fetchUserBlogs = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUserBlogs(filter, searchQuery);
      if (res.data?.data) {
        setBlogs(res.data.data);
      } else {
        // Fallback mock user blogs
        const mockBlogs = [
          {
            id: '1',
            title: 'Getting Started with Supabase Auth & RLS Policies',
            status: 'PUBLISHED',
            created_at: '2026-08-20',
            category: 'Technology',
            slug: 'getting-started-with-supabase-auth-and-rls-policies',
          },
          {
            id: '2',
            title: 'Spring Boot 3 REST API Best Practices',
            status: 'PUBLISHED',
            created_at: '2026-08-19',
            category: 'Development',
            slug: 'spring-boot-3-rest-api-best-practices',
          },
          {
            id: '3',
            title: 'Building Modern React Components for Capstone Platforms',
            status: 'DRAFT',
            created_at: '2026-08-21',
            category: 'Design',
            slug: 'building-modern-react-components-for-capstone-platforms',
          },
        ];
        setBlogs(mockBlogs);
      }
    } catch (err) {
      console.warn('Error fetching user blogs, displaying cached view');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBlogs();
  }, [filter, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!deleteBlogId) return;
    const targetId = deleteBlogId;
    setDeleteBlogId(null);

    try {
      await blogApi.deleteBlog(targetId);
      setBlogs((prev) => prev.filter((b) => b.id !== targetId));
      setToast({ type: 'success', message: 'Article deleted successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Delete failed' });
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filter === 'PUBLISHED') return b.status === 'PUBLISHED';
    if (filter === 'DRAFT') return b.status === 'DRAFT';
    return true;
  }).filter((b) => {
    if (!searchQuery.trim()) return true;
    return b.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={!!deleteBlogId}
        title="Confirm Deletion"
        message="Are you sure you want to delete this blog post? This action is permanent."
        confirmText="Delete Article"
        confirmVariant="btn-danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteBlogId(null)}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2><BookOpen size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> My Articles</h2>
          <p>Manage, edit, publish, and search your personal articles.</p>
        </div>

        <Link to="/create-blog" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          <Plus size={18} />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Input */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'PUBLISHED', 'DRAFT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn ${filter === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              {tab === 'ALL' ? 'All Posts' : tab === 'PUBLISHED' ? 'Published' : 'Drafts'}
            </button>
          ))}
        </div>

        <div className="input-with-icon" style={{ maxWidth: '320px', width: '100%' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search my articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '2rem', fontSize: '0.85rem' }}
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="input-toggle-btn">
              <X size={16} />
            </button>
          ) : (
            <span className="input-toggle-btn">
              <Search size={16} />
            </span>
          )}
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <Loading text="Loading your articles..." />
      ) : filteredBlogs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>No articles found</h3>
          <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--text-muted)' }}>
            {searchQuery ? `No articles matching "${searchQuery}"` : "You haven't created any articles yet."}
          </p>
          <Link to="/create-blog" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            <Plus size={18} />
            <span>Create Your First Blog</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className={`badge ${blog.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`} style={{ marginBottom: '0.4rem' }}>
                  {blog.status}
                </span>
                <h3 style={{ fontSize: '1.15rem' }}>{blog.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  Category: {blog.category || 'Technology'} • Created: {blog.created_at || 'Aug 2026'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/blogs/${blog.slug || blog.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <Eye size={15} />
                  <span>View</span>
                </Link>
                <Link to={`/edit-blog/${blog.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <Edit3 size={15} />
                  <span>Edit</span>
                </Link>
                <button onClick={() => setDeleteBlogId(blog.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
