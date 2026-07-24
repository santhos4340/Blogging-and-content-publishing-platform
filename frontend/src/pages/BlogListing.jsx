import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi, categoryApi } from '../api/apiService';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, Layers, ChevronLeft, ChevronRight, BookOpen, ArrowRight, X } from 'lucide-react';

const BlogListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('query') || '';

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        if (res.data?.data) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.warn('Categories API error');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let res;
        if (searchQuery.trim()) {
          res = await blogApi.searchBlogs(searchQuery.trim(), page, 9);
        } else if (selectedCategory) {
          res = await blogApi.getBlogsByCategory(selectedCategory, page, 9);
        } else {
          res = await blogApi.getPublishedBlogs(page, 9);
        }

        const data = res.data?.data || res.data;
        if (data && data.content) {
          setBlogs(data.content);
          setTotalPages(data.totalPages || 1);
          setTotalElements(data.totalElements || data.content.length);
        } else {
          // Fallback mock published list for demonstration
          const mockData = [
            {
              id: '1',
              title: 'Building Scalable Spring Boot Services with PostgreSQL',
              slug: 'building-scalable-spring-boot-services-with-postgresql',
              excerpt: 'Learn clean architecture patterns, repository abstractions, and enterprise database integration strategies.',
              category: 'Technology',
              authorName: 'Alex Morgan',
              publishedAt: '2026-08-20',
              featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            },
            {
              id: '2',
              title: 'Modern UI Design Principles for Capstone Projects',
              slug: 'modern-ui-design-principles-for-capstone-projects',
              excerpt: 'How to combine dark modes, glassmorphism, fluid responsive layouts, and accessible color tokens.',
              category: 'Design',
              authorName: 'Sarah Chen',
              publishedAt: '2026-08-19',
              featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
            },
            {
              id: '3',
              title: 'Supabase Authentication & Row Level Security Deep Dive',
              slug: 'supabase-authentication-row-level-security-deep-dive',
              excerpt: 'Secure user profiles, enforce database isolation rules, and manage persistent JWT sessions in React.',
              category: 'Development',
              authorName: 'David Miller',
              publishedAt: '2026-08-21',
              featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
            },
          ];
          setBlogs(mockData);
          setTotalPages(1);
          setTotalElements(mockData.length);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, selectedCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleCategorySelect = (catName) => {
    if (selectedCategory === catName) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(catName);
    }
    setPage(0);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPage(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner & Search Bar */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Explore Published Articles</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
          Discover tutorials, engineering insights, and design thoughts published by our community.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: '550px', margin: '0 auto' }}>
          <div className="input-with-icon">
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, excerpt, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: 'var(--radius-full)', paddingLeft: '1.25rem' }}
            />
            <button type="submit" className="input-toggle-btn" style={{ right: '1rem' }}>
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Category Pills & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.5rem' }}>
            <Layers size={16} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} /> Filter:
          </span>

          <button
            onClick={() => handleCategorySelect('')}
            className={`badge ${!selectedCategory ? 'badge-published' : 'badge-draft'}`}
            style={{ cursor: 'pointer', padding: '0.4rem 0.8rem' }}
          >
            All Categories
          </button>

          {['Technology', 'Design', 'Development', 'Career Growth'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`badge ${selectedCategory === cat ? 'badge-published' : 'badge-draft'}`}
              style={{ cursor: 'pointer', padding: '0.4rem 0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {(selectedCategory || searchQuery) && (
          <button onClick={clearFilters} className="btn btn-secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
            <X size={14} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : blogs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>No published blogs found</h3>
          <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--text-muted)' }}>
            Try adjusting your search query or category filter to find what you're looking for.
          </p>
          <button onClick={clearFilters} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            View All Articles
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {blogs.map((blog) => (
            <div key={blog.id || blog.slug} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {blog.featuredImage && (
                  <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '160px', marginBottom: '1rem' }}>
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-published">{blog.category || 'Technology'}</span>
                </div>

                <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                  {blog.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {blog.excerpt || (blog.content ? blog.content.substring(0, 100) + '...' : 'No excerpt provided.')}
                </p>
              </div>

              <div>
                <div className="card-meta" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <span>By {blog.authorName || 'Author'}</span> • <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Published'}</span>
                </div>

                <Link to={`/blogs/${blog.slug || blog.id}`} className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem' }}>
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Server-Side Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem' }}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={page >= totalPages - 1}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem' }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogListing;
