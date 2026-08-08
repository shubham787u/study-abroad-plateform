import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Mail, Phone, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="brand-logo" style={{ marginBottom: '1rem' }}>
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <span>StudyAbroad<span style={{ color: 'var(--secondary)' }}>Hub</span></span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '340px' }}>
            Empowering students worldwide to discover, compare, and apply to top-ranked international university programs seamlessly.
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', color: 'var(--text-subtle)' }}>
            <span style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Globe size={14} /> Global Admissions
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li><Link to="/programs" style={{ transition: 'color 0.2s' }}>All Programs</Link></li>
            <li><Link to="/universities" style={{ transition: 'color 0.2s' }}>Universities</Link></li>
            <li><Link to="/recommendations" style={{ transition: 'color 0.2s' }}>AI Matcher</Link></li>
            <li><Link to="/applications" style={{ transition: 'color 0.2s' }}>My Applications</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Destinations
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li><Link to="/programs?country=USA">United States</Link></li>
            <li><Link to="/programs?country=UK">United Kingdom</Link></li>
            <li><Link to="/programs?country=Canada">Canada</Link></li>
            <li><Link to="/programs?country=Australia">Australia</Link></li>
            <li><Link to="/programs?country=Germany">Germany</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Support & Contact
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} style={{ color: 'var(--primary)' }} /> support@studyabroadhub.com
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={14} style={{ color: 'var(--secondary)' }} /> +1 (800) 555-STUDY
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} StudyAbroadHub Platform. Built with React, Vite & Express API.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          Crafted with <Heart size={14} style={{ color: 'var(--accent-rose)' }} /> for Global Scholars
        </p>
      </div>
    </footer>
  );
};

export default Footer;
