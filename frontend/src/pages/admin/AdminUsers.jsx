import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/apiService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { Users, Search, Shield, UserCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(0, 50, searchQuery, roleFilter);
      if (res.data?.data?.content) {
        setUsers(res.data.data.content);
      } else {
        // Fallback mock user list
        setUsers([
          { id: '1', fullName: 'Santhos', email: 'santhos@example.com', role: 'ADMIN', createdAt: '2026-07-24' },
          { id: '2', fullName: 'Alex Morgan', email: 'alex@example.com', role: 'USER', createdAt: '2026-07-31' },
          { id: '3', fullName: 'Sarah Chen', email: 'sarah@example.com', role: 'USER', createdAt: '2026-08-05' },
          { id: '4', fullName: 'David Miller', email: 'david@example.com', role: 'USER', createdAt: '2026-08-12' },
        ]);
      }
    } catch (err) {
      console.warn('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  const handleRoleChangeSelect = (userId, newRole) => {
    const userObj = users.find((u) => u.id === userId);
    setPendingRoleChange({ userId, newRole, userName: userObj?.fullName || 'User' });
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    const { userId, newRole } = pendingRoleChange;
    setPendingRoleChange(null);

    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setToast({ type: 'success', message: `User role updated to ${newRole}!` });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update user role' });
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (!searchQuery.trim()) return true;
    return (
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={!!pendingRoleChange}
        title="Confirm Role Change"
        message={`Are you sure you want to change ${pendingRoleChange?.userName}'s role to ${pendingRoleChange?.newRole}?`}
        confirmText="Change Role"
        confirmVariant="btn-primary"
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setPendingRoleChange(null)}
      />

      <AdminSidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2><Users size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> User Account Management</h2>

          {/* Search & Role Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: '130px', padding: '0.45rem' }}>
              <option value="ALL">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div className="input-with-icon" style={{ width: '220px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search user name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.85rem' }}
              />
              <span className="input-toggle-btn"><Search size={14} /></span>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading text="Loading user accounts..." />
        ) : (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Joined Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{u.fullName}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-published' : 'badge-draft'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <select
                        className="form-select"
                        value={u.role}
                        onChange={(e) => handleRoleChangeSelect(u.id, e.target.value)}
                        style={{ width: '110px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
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

export default AdminUsers;
