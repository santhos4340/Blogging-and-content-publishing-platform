import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Layers, MessageSquare, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logoutUser } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/users', label: 'Users Management', icon: <Users size={18} /> },
    { to: '/admin/blogs', label: 'Blogs Moderation', icon: <FileText size={18} /> },
    { to: '/admin/categories', label: 'Categories Admin', icon: <Layers size={18} /> },
    { to: '/admin/comments', label: 'Comments Moderation', icon: <MessageSquare size={18} /> },
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      borderRadius: 'var(--radius-md)',
      height: 'fit-content',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 0.5rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
        <Shield size={22} color="var(--primary)" />
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>Admin Panel</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={logoutUser}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'flex-start' }}
        >
          <LogOut size={16} />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
