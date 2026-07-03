import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Landing from './pages/Landing';
import BlogListing from './pages/BlogListing';
import CategoriesPage from './pages/CategoriesPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetails from './pages/BlogDetails';
import MyBlogs from './pages/MyBlogs';
import Profile from './pages/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminCategories from './pages/admin/AdminCategories';
import AdminComments from './pages/admin/AdminComments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/blogs" element={<BlogListing />} />
              <Route path="/blogs/:slug" element={<BlogDetails />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-blog"
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-blog/:id"
                element={
                  <ProtectedRoute>
                    <EditBlog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-blogs"
                element={
                  <ProtectedRoute>
                    <MyBlogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs"
                element={
                  <AdminProtectedRoute>
                    <AdminBlogs />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminProtectedRoute>
                    <AdminCategories />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/comments"
                element={
                  <AdminProtectedRoute>
                    <AdminComments />
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
