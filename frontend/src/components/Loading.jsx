import React from 'react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{text}</p>
    </div>
  );
};

export default Loading;
