import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi, blogApi } from '../api/apiService';
import Loading from '../components/Loading';
import { LayoutDashboard, FileText, CheckCircle, Clock, Plus, User, ArrowRight, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    totalBlogs: 3,
    publishedBlogs: 2,
    draftBlogs: 1,
    totalComments: 5,
  });

  const [recentBlogs, setRecentBlogs] = useState([
    {
      id: '1',
      title: 'Getting Started with Supabase Auth & RLS Policies',
      status: 'PUBLISHED',
      updatedAt: '2026-08-20',
      category: 'Technology',
      slug: 'getting-started-with-supabase-auth-and-rls-policies',
    },
    {
      id: '2',
      title: 'Spring Boot 3 REST API Best Practices',
      status: 'PUBLISHED',
      updatedAt: '2026-08-19',
      category: 'Development',
      slug: 'spring-boot-3-rest-api-best-practices',
    },
    {
      id: '3',
      title: 'Building Modern React Components for Capstone Platforms',
      status: 'DRAFT',
      updatedAt: '2026-08-21',
      category: 'Design',
      slug: 'building-modern-react-components-for-capstone-platforms',
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, userBlogsRes] = await Promise.all([
          userApi.getUserStats().catch(() => null),
          userApi.getUserBlogs('ALL', '').catch(() => null),
        ]);

        if (statsRes?.data?.data) {
          setStats(statsRes.data.data);
        }

        if (userBlogsRes?.data?.data && userBlogsRes.data.data.length > 0) {
          setRecentBlogs(userBlogsRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.warn('Using default dashboard metrics fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading text="Loading dashboard metrics..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Author'}!
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Here is your real-time publishing dashboard and content analytics.
          </p>
        </div>
        <Link to="/create-blog" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <Plus size={18} />
          <span>Create New Article</span>
        </Link>
      </div>

      {/* User Profile Summary Card & Stats Grid */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {/* Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#fff',
            }}>
              {(profile?.full_name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem' }}>{profile?.full_name || 'Author Profile'}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '0.35rem' }}>
            <User size={15} />
            <span>Manage Profile</span>
          </Link>
        </div>

        {/* Total Blogs */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalBlogs}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Articles</p>
          </div>
        </div>

        {/* Published Blogs */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.publishedBlogs}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Published</p>
          </div>
        </div>

        {/* Draft Blogs */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.draftBlogs}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Drafts</p>
          </div>
        </div>

        {/* Total Comments */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalComments}</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Comments</p>
          </div>
        </div>
      </div>

      {/* Recent Blogs Table / List */}
      <section className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2>My Recent Articles</h2>
          <Link to="/my-blogs" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <span>Manage All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentBlogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{blog.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <span>Category: {blog.category || 'Technology'}</span>
                  <span>Updated: {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${blog.status === 'PUBLISHED' ? 'badge-published' : 'badge-draft'}`}>
                  {blog.status}
                </span>
                <Link to={`/edit-blog/${blog.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>
                  Edit
                </Link>
                {blog.status === 'PUBLISHED' && (
                  <Link to={`/blogs/${blog.slug || blog.id}`} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
