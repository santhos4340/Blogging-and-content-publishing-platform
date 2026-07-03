import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#ef4444" />,
    info: <Info size={18} color="#6366f1" />,
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        {icons[type]}
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
