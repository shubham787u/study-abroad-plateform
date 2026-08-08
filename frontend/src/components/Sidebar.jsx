import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Landmark,
  Sparkles,
  FileCheck2,
  User,
  LogOut,
  BookOpen,
} from 'lucide-react';

const sidebarNavItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', requiresAuth: true },
  { to: '/programs', icon: <GraduationCap size={18} />, label: 'Programs', requiresAuth: false },
  { to: '/universities', icon: <Landmark size={18} />, label: 'Universities', requiresAuth: false },
  { to: '/recommendations', icon: <Sparkles size={18} />, label: 'AI Matcher', requiresAuth: false },
  { to: '/applications', icon: <FileCheck2 size={18} />, label: 'Applications', requiresAuth: true },
  { to: '/profile', icon: <User size={18} />, label: 'My Profile', requiresAuth: true },
];

const Sidebar = ({ onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <aside
      style={{
        width: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '1.5rem 0',
      }}
    >
      {/* User Profile Summary */}
      {isAuthenticated && user && (
        <div
          style={{
            padding: '1rem 1.5rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </p>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.775rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {sidebarNavItems
          .filter((item) => !item.requiresAuth || isAuthenticated)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? '#a5b4fc' : 'var(--text-muted)',
                background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
      </nav>

      {/* Logout at bottom */}
      {isAuthenticated && (
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            className="btn btn-danger btn-sm"
            style={{ width: '100%' }}
            onClick={() => {
              logout();
              if (onClose) onClose();
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
