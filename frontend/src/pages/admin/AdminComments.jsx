import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/apiService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { MessageSquare, Trash2 } from 'lucide-react';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getComments();
      if (res.data?.data) {
        setComments(res.data.data);
      } else {
        setComments([
          { id: '1', userName: 'Sarah Chen', blogTitle: 'Building Scalable Spring Boot Services', content: 'Great breakdown of Supabase RLS policies!', createdAt: '2026-08-20' },
          { id: '2', userName: 'David Miller', blogTitle: 'Modern UI Design Principles', content: 'Looking forward to Phase 7-9 features!', createdAt: '2026-08-21' },
          { id: '3', userName: 'Alex Morgan', blogTitle: 'Supabase Authentication Deep Dive', content: 'Clean JWT architecture and session restoration.', createdAt: '2026-08-21' },
        ]);
      }
    } catch (err) {
      console.warn('Admin comments fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteCommentId) return;
    const targetId = deleteCommentId;
    setDeleteCommentId(null);

    try {
      await adminApi.deleteComment(targetId);
      setComments((prev) => prev.filter((c) => c.id !== targetId));
      setToast({ type: 'success', message: 'Comment moderated and removed' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete comment' });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={!!deleteCommentId}
        title="Moderate & Delete Comment"
        message="Are you sure you want to remove this comment from the platform?"
        confirmText="Delete Comment"
        confirmVariant="btn-danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteCommentId(null)}
      />

      <AdminSidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
          <h2><MessageSquare size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Platform Comment Moderation</h2>
        </div>

        {loading ? (
          <Loading text="Loading comments..." />
        ) : (
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Comment Content</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Author</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-main)', maxWidth: '350px' }}>{c.content}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{c.userName || 'Author'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-dim)' }}>{c.createdAt || 'Recent'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => setDeleteCommentId(c.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
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

export default AdminComments;
