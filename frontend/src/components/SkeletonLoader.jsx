import React from 'react';

const SkeletonCard = () => (
  <div className="card" style={{ height: '240px', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
    <div style={{ width: '30%', height: '20px', background: 'var(--border-color)', borderRadius: '4px' }} />
    <div style={{ width: '85%', height: '24px', background: 'var(--border-color)', borderRadius: '4px' }} />
    <div style={{ width: '100%', height: '60px', background: 'var(--border-color)', borderRadius: '4px' }} />
    <div style={{ width: '50%', height: '16px', background: 'var(--border-color)', borderRadius: '4px', marginTop: 'auto' }} />
  </div>
);

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
