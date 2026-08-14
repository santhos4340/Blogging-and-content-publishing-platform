import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/apiService';
import Toast from '../components/Toast';
import { User, Mail, Save, Calendar, FileText, CheckCircle, Clock, Shield } from 'lucide-react';

const Profile = () => {
  const { user, profile, updateProfileData } = useAuth();

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    avatarUrl: profile?.avatar_url || '',
    bio: profile?.bio || '',
  });

  const [stats, setStats] = useState({
    totalBlogs: 3,
    publishedBlogs: 2,
    draftBlogs: 1,
  });

  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        avatarUrl: profile.avatar_url || '',
        bio: profile.bio || '',
      });
    }

    const fetchStats = async () => {
      try {
        const res = await userApi.getUserStats();
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Stats fetch error');
      }
    };
    fetchStats();
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'avatarUrl') setImageError(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    const result = await updateProfileData({
      full_name: formData.fullName.trim(),
      avatar_url: formData.avatarUrl.trim(),
      bio: formData.bio.trim(),
    });

    if (result.success) {
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to update profile' });
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Profile Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem' }}>
        <div style={{ position: 'relative' }}>
          {formData.avatarUrl && !imageError ? (
            <img
              src={formData.avatarUrl}
              alt="Avatar"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                boxShadow: 'var(--shadow-glow)',
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: 'var(--shadow-glow)',
            }}>
              {(formData.fullName || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
            <h1 style={{ fontSize: '1.8rem' }}>{formData.fullName || 'Author Profile'}</h1>
            <span className={`badge ${profile?.role === 'ADMIN' ? 'badge-published' : 'badge-draft'}`}>
              {profile?.role || 'USER'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{user?.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            <Calendar size={14} /> Account Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '2026'}
          </div>
        </div>
      </div>

      {/* Account Statistics Cards */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalBlogs}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Articles</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.publishedBlogs}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Published</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.draftBlogs}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Drafts</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Edit Profile Information</h2>

        <form onSubmit={handleSubmit}>
          {/* Email (Read Only) */}
          <div className="form-group">
            <label className="form-label">Email Address (Auth Identifier)</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              required
              disabled={submitting}
            />
          </div>

          {/* Avatar URL */}
          <div className="form-group">
            <label className="form-label">Avatar Image URL</label>
            <input
              type="url"
              name="avatarUrl"
              className="form-input"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
              disabled={submitting}
            />
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">Author Bio</label>
            <textarea
              name="bio"
              rows={4}
              className="form-textarea"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a brief biography for your readers..."
              disabled={submitting}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.5rem' }}
              disabled={submitting}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
