import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmVariant = 'btn-danger' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
    }}>
      <div className="glass-panel" style={{ maxWidth: '450px', width: '100%', padding: '1.75rem', position: 'relative' }}>
        <button
          onClick={onCancel}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: 0 }}>{title}</h3>
        </div>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className={`btn ${confirmVariant}`} style={{ padding: '0.5rem 1rem' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
