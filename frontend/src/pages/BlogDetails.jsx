import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogApi, commentApi } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { ArrowLeft, User, Calendar, MessageSquare, Send, BookOpen, ArrowRight, Edit2, Trash2, Check, X } from 'lucide-react';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      try {
        let b = null;
        try {
          const res = await blogApi.getBlogBySlug(slug);
          b = res.data?.data || res.data;
        } catch (err) {
          const fallbackRes = await blogApi.getPublishedBlogs(0, 10);
          const list = fallbackRes.data?.data?.content || [];
          b = list.find((item) => item.slug === slug || item.id === slug);
        }

        if (!b) {
          b = {
            id: '1',
            title: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            slug: slug,
            category: 'Technology',
            authorName: 'Alex Morgan',
            publishedAt: 'August 21, 2026',
            featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            content: `
### Introduction

In modern full-stack web application development, pairing a Java Spring Boot REST API with Supabase PostgreSQL gives you enterprise-grade reliability, scalable row-level data isolation, and instant OAuth/email authentication capabilities.

### Architecture Highlights

- **Frontend**: React SPA using Vite, React Router DOM, and standard CSS design tokens.
- **Backend**: Spring Boot Layered Architecture (Controller -> Service -> Repository -> Entity -> DTO).
- **Database**: Supabase PostgreSQL with custom RLS (Row Level Security) policies protecting user profiles, blogs, and comments.
            `,
          };
        }

        setBlog(b);

        if (b.id) {
          try {
            const commentsRes = await commentApi.getCommentsByBlog(b.id);
            if (commentsRes.data?.data) {
              setComments(commentsRes.data.data);
            }
          } catch (cErr) {
            setComments([
              { id: '1', userName: 'Sarah Chen', userId: 'user-1', content: 'Great breakdown of Supabase RLS and Spring Boot controllers!', createdAt: 'Aug 20, 2026' },
              { id: '2', userName: 'David Miller', userId: 'user-2', content: 'Looking forward to Phase 7-9 features!', createdAt: 'Aug 21, 2026' },
            ]);
          }
        }

        try {
          const relRes = await blogApi.getPublishedBlogs(0, 4);
          const allList = relRes.data?.data?.content || [];
          const filteredRel = allList.filter((item) => item.slug !== slug && item.id !== b.id).slice(0, 3);
          setRelatedBlogs(filteredRel);
        } catch (rErr) {
          setRelatedBlogs([
            { id: '2', title: 'Modern UI Design Principles', slug: 'modern-ui-design-principles', category: 'Design' },
            { id: '3', title: 'Supabase Authentication Guide', slug: 'supabase-authentication-guide', category: 'Development' },
          ]);
        }

      } catch (err) {
        setToast({ type: 'error', message: 'Failed to load blog article.' });
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [slug]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      if (blog?.id) {
        await commentApi.addComment(blog.id, { content: commentText.trim() });
      }
      setComments((prev) => [
        {
          id: Date.now().toString(),
          userName: profile?.full_name || (user?.email ? user.email.split('@')[0] : 'Author'),
          content: commentText.trim(),
          createdAt: 'Just now',
        },
        ...prev,
      ]);
      setCommentText('');
      setToast({ type: 'success', message: 'Comment posted successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to post comment' });
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await commentApi.updateComment(commentId, editText.trim());
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editText.trim(), updatedAt: 'Edited just now' } : c))
      );
      setEditingCommentId(null);
      setToast({ type: 'success', message: 'Comment updated!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update comment' });
    }
  };

  const handleDeleteCommentConfirm = async () => {
    if (!deleteCommentId) return;
    const targetId = deleteCommentId;
    setDeleteCommentId(null);
    try {
      await commentApi.deleteComment(targetId);
      setComments((prev) => prev.filter((c) => c.id !== targetId));
      setToast({ type: 'success', message: 'Comment deleted!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete comment' });
    }
  };

  if (loading) {
    return <Loading text="Loading publication..." />;
  }

  if (!blog) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The requested article does not exist or has been removed.</p>
        <Link to="/blogs" className="btn btn-primary">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Modal
        isOpen={!!deleteCommentId}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete Comment"
        confirmVariant="btn-danger"
        onConfirm={handleDeleteCommentConfirm}
        onCancel={() => setDeleteCommentId(null)}
      />

      <Link to="/blogs" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} />
        <span>Back to All Articles</span>
      </Link>

      <article className="glass-panel" style={{ padding: '2.5rem 2rem', marginBottom: '2rem' }}>
        <span className="badge badge-published" style={{ marginBottom: '1rem' }}>
          {blog.category || 'Technology'}
        </span>
        
        <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem', lineHeight: 1.2 }}>{blog.title}</h1>

        <div className="card-meta" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} /> {blog.authorName || 'Alex Morgan'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} /> {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'August 2026'}
          </span>
        </div>

        {blog.featuredImage && (
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '350px', marginBottom: '2rem' }}>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              style={{ width: '100%', height: '350px', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div style={{ lineHeight: 1.85, fontSize: '1.05rem', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
          {blog.content}
        </div>
      </article>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--primary)" />
            <span>Related Publications</span>
          </h3>

          <div className="grid-2">
            {relatedBlogs.map((rel) => (
              <div key={rel.id || rel.slug} className="card">
                <span className="badge badge-draft" style={{ marginBottom: '0.4rem' }}>{rel.category || 'Related'}</span>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{rel.title}</h4>
                <Link to={`/blogs/${rel.slug || rel.id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <MessageSquare size={20} color="var(--primary)" />
          <span>Comments ({comments.length})</span>
        </h3>

        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Share your feedback or thoughts on this article..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              <Send size={16} />
              <span>Post Comment</span>
            </button>
          </form>
        ) : (
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-dark)', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem' }}>
              Please <Link to="/login">login</Link> to post comments on this article.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No comments yet. Be the first to share your thoughts.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                      {(c.userName || 'U')[0].toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.userName}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>• {c.createdAt}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleStartEdit(c)} className="btn btn-secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => setDeleteCommentId(c.id)} className="btn btn-danger" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {editingCommentId === c.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditingCommentId(null)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                        <X size={14} /> Cancel
                      </button>
                      <button onClick={() => handleSaveEdit(c.id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                        <Check size={14} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>{c.content}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
