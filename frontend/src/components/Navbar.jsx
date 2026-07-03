import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather, LayoutDashboard, PenTool, BookOpen, User, LogOut, LogIn, UserPlus, Grid, Layers, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, profile, isAdmin, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Feather size={26} color="#6366f1" />
          <span>InkSphere</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                <BookOpen size={18} />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Grid size={18} />
                <span>Explore Blogs</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={18} />
                <span>Categories</span>
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                      <Shield size={18} color="var(--primary)" />
                      <span>Admin Panel</span>
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/my-blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <BookOpen size={18} />
                    <span>My Articles</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create-blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <PenTool size={18} />
                    <span>Write</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <User size={18} />
                    <span>{profile?.full_name || 'Profile'}</span>
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}>
                    <UserPlus size={16} />
                    <span>Get Started</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
