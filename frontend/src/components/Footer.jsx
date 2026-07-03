import React from 'react';
import { Feather } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <Feather size={20} color="#6366f1" />
          <span>InkSphere</span>
        </div>
        <p>© {new Date().getFullYear()} InkSphere Platform. Capstone Project — All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#docs">API Docs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
