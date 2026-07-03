import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Layers, Feather, UserCheck, ShieldCheck } from 'lucide-react';

const Landing = () => {
  const featuredCategories = [
    { title: 'Technology', desc: 'System design, Cloud, AI & Web Dev', count: '142 Articles' },
    { title: 'Design & UX', desc: 'Glassmorphism, animations & color systems', count: '89 Articles' },
    { title: 'Software Engineering', desc: 'Java, Spring Boot, Architecture & Clean Code', count: '115 Articles' },
    { title: 'Career Growth', desc: 'Technical interviews, leadership & resume advice', count: '64 Articles' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Section */}
      <section className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }} />

        <span className="badge badge-published" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
          <Sparkles size={14} style={{ marginRight: '0.4rem' }} /> Capstone Publishing Platform v1.0
        </span>
        
        <h1 style={{ fontSize: '3rem', maxWidth: '800px', margin: '0 auto 1.25rem', fontWeight: 800, lineHeight: 1.15 }}>
          Share Your Ideas with the World on <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InkSphere</span>
        </h1>
        
        <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto 2rem', color: 'var(--text-muted)' }}>
          A high-performance content platform built with React, Spring Boot REST API, and Supabase PostgreSQL with Row Level Security.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <span>Start Writing Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}>
            <span>Sign In to Account</span>
          </Link>
        </div>
      </section>

      {/* Featured Blog Highlight */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2><TrendingUp size={22} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Featured Publications</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Curated by top contributors</span>
        </div>

        <div className="grid-2">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-published" style={{ marginBottom: '0.75rem' }}>Technology</span>
              <h3 className="card-title">Building Scalable Spring Boot Services with PostgreSQL</h3>
              <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.95rem' }}>
                Learn clean architecture patterns, repository abstractions, and enterprise database integration strategies for modern backend services.
              </p>
            </div>
            <div className="card-meta">
              <span>By Alex Morgan</span> • <span>5 min read</span> • <span>Aug 2026</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-published" style={{ marginBottom: '0.75rem' }}>Design</span>
              <h3 className="card-title">Modern UI Design Principles for Capstone Projects</h3>
              <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.95rem' }}>
                How to combine dark modes, glassmorphism, fluid responsive layouts, and accessible color tokens to create awe-inspiring user interfaces.
              </p>
            </div>
            <div className="card-meta">
              <span>By Sarah Chen</span> • <span>8 min read</span> • <span>Aug 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2><Layers size={22} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Explore Categories</h2>
          <p>Browse content organized by software domain and engineering discipline</p>
        </div>

        <div className="grid-2">
          {featuredCategories.map((cat, idx) => (
            <div key={idx} className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3>{cat.title}</h3>
                <span className="badge badge-draft">{cat.count}</span>
              </div>
              <p>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features / Call to Action */}
      <section className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready to Publish Your First Article?</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Join our community of developers, designers, and tech enthusiasts. Seamless authentication, RLS protected databases, and full Spring Boot REST API integration.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <span>Create Your Account</span>
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default Landing;
