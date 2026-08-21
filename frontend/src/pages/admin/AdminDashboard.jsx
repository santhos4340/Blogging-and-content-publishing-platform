import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/apiService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loading from '../../components/Loading';
import { Users, FileText, CheckCircle, Clock, MessageSquare, Layers, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 24,
    totalBlogs: 42,
    publishedBlogs: 30,
    draftBlogs: 12,
    totalComments: 118,
    totalCategories: 6,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getStats();
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn('Admin stats API fallback');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <Loading text="Loading admin analytics..." />;
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
      <AdminSidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={26} color="var(--primary)" /> System Administration Overview
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Monitor system users, moderate content publications, and manage categories.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid-3">
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <Users size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalUsers}</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Users</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)' }}>
              <FileText size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalBlogs}</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Articles</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
              <Clock size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.draftBlogs}</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Draft Articles</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
              <MessageSquare size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalComments}</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Comments</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Layers size={26} />
            </div>
            <div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalCategories}</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Categories</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
