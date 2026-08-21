import axios from 'axios';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Supabase JWT auth token to backend requests
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error fetching session for API request:', error);
  }
  return config;
}, (error) => Promise.reject(error));

export const healthApi = {
  getHealth: () => api.get('/health'),
};

export const blogApi = {
  getPublishedBlogs: (page = 0, size = 9) => api.get(`/blogs?page=${page}&size=${size}`),
  getBlogById: (id) => api.get(`/blogs/${id}`),
  getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  searchBlogs: (query, page = 0, size = 9) => api.get(`/blogs/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),
  getBlogsByCategory: (categorySlug, page = 0, size = 9) => api.get(`/blogs/category/${categorySlug}?page=${page}&size=${size}`),
  createBlog: (blogData) => api.post('/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (profileData) => api.put('/users/me', profileData),
  getUserBlogs: (status = 'ALL', query = '') => api.get(`/users/me/blogs?status=${status}&query=${encodeURIComponent(query)}`),
  getUserStats: () => api.get('/users/me/stats'),
};

export const commentApi = {
  getCommentsByBlog: (blogId) => api.get(`/blogs/${blogId}/comments`),
  addComment: (blogId, commentData) => api.post(`/blogs/${blogId}/comments`, commentData),
  updateComment: (id, content) => api.put(`/comments/${id}`, { content }),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 0, size = 10, query = '', role = 'ALL') => api.get(`/admin/users?page=${page}&size=${size}&query=${encodeURIComponent(query)}&role=${role}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getBlogs: () => api.get('/admin/blogs'),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getComments: () => api.get('/admin/comments'),
  deleteComment: (id) => api.delete(`/admin/comments/${id}`),
};

export default api;
