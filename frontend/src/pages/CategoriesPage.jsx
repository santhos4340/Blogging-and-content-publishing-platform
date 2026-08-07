import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api/apiService';
import SkeletonLoader from '../components/SkeletonLoader';
import { Layers, ArrowRight, BookOpen } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryApi.getCategories();
        if (res.data?.data) {
          setCategories(res.data.data);
        } else {
          setCategories([
            { id: '1', name: 'Technology', slug: 'technology', description: 'Latest trends in tech, software engineering, and AI', count: 12 },
            { id: '2', name: 'Design', slug: 'design', description: 'UI/UX design, graphics, and web aesthetics', count: 8 },
            { id: '3', name: 'Development', slug: 'development', description: 'Coding tutorials, full-stack development, and architecture', count: 15 },
            { id: '4', name: 'Career Growth', slug: 'career-growth', description: 'Tips on career advancement and personal development', count: 6 },
          ]);
        }
      } catch (err) {
        console.warn('Categories API error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Browse Categories</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
          Explore articles grouped by technical discipline, software design, and engineering career growth.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <div className="grid-2">
          {categories.map((cat) => (
            <div key={cat.id || cat.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.3rem' }}>{cat.name}</h3>
                  <span className="badge badge-published">Active Category</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  {cat.description || 'Comprehensive collection of articles and tutorials.'}
                </p>
              </div>

              <Link to={`/blogs?category=${encodeURIComponent(cat.name)}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                <span>View Category Articles</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
