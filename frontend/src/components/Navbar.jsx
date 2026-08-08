import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Landmark,
  FileCheck2,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <span>StudyAbroad<span style={{ color: 'var(--secondary)' }}>Hub</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : undefined }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <BookOpen size={16} />
            Home
          </NavLink>

          <NavLink to="/programs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <GraduationCap size={16} />
            Programs
          </NavLink>

          <NavLink to="/universities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Landmark size={16} />
            Universities
          </NavLink>

          <NavLink to="/recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
            AI Matches
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FileCheck2 size={16} />
                Applications
              </NavLink>

              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
            </>
          )}
        </nav>

        {/* Right side auth controls */}
        <div className="nav-auth-buttons">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/profile"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)', paddingLeft: '0.85rem', paddingRight: '0.85rem' }}
              >
                <User size={15} style={{ color: 'var(--primary)' }} />
                <span>{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
              </Link>

              <button className="btn btn-danger btn-sm" onClick={handleLogout} title="Sign Out">
                <LogOut size={15} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} />
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
