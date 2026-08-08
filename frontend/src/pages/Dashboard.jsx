import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import applicationService from '../services/applicationService';
import recommendationService from '../services/recommendationService';
import StatusBadge from '../components/StatusBadge';
import ProgramCard from '../components/ProgramCard';
import Loader from '../components/Loader';
import {
  LayoutDashboard,
  FileCheck2,
  Sparkles,
  UserCheck,
  Globe,
  DollarSign,
  Award,
  Calendar,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appRes, recRes] = await Promise.all([
          applicationService.getMyApplications(),
          recommendationService.getUserProfileRecommendations(),
        ]);

        if (appRes?.data) setApplications(appRes.data);
        if (recRes?.data) setRecommendations(recRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.25rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Welcome back, {user?.name || 'Scholar'}!</h1>
            <span className="badge badge-neutral" style={{ textTransform: 'uppercase' }}>
              {user?.role || 'Student'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your study abroad journey, track application status, and view AI recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/recommendations" className="btn btn-accent btn-sm">
            <Sparkles size={16} />
            Run Matcher
          </Link>
          <Link to="/profile" className="btn btn-secondary btn-sm">
            Edit Preferences
          </Link>
        </div>
      </div>

      {/* Quick Summary Stat Cards */}
      <div className="grid-4">
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Applications</span>
            <FileCheck2 size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.85rem' }}>{applications.length}</h2>
          <p style={{ color: 'var(--accent-emerald)', fontSize: '0.775rem', marginTop: '0.2rem' }}>
            Active Tracker
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI Matches</span>
            <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.85rem' }}>{recommendations.length}</h2>
          <p style={{ color: '#a5b4fc', fontSize: '0.775rem', marginTop: '0.2rem' }}>
            Tailored Programs
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Target Country</span>
            <Globe size={20} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <h2 style={{ fontSize: '1.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.preferredCountry || 'Any Country'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '0.2rem' }}>
            {user?.preferredField || 'General Studies'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>IELTS & Budget</span>
            <Award size={20} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <h2 style={{ fontSize: '1.35rem' }}>
            {user?.ieltsScore ? `${user.ieltsScore} Band` : 'N/A'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '0.2rem' }}>
            Budget: ${user?.budget ? user.budget.toLocaleString() : 'Open'}
          </p>
        </div>
      </div>

      {/* Main Content Grid: Recent Applications & Recommended Programs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.75rem' }}>
        {/* Applications Tracker Card */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck2 size={20} style={{ color: 'var(--primary)' }} />
              My Submitted Applications
            </h3>
            <Link to="/applications" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading applications..." />
          ) : applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <FileCheck2 size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
              <p style={{ marginBottom: '1rem' }}>You haven't submitted any program applications yet.</p>
              <Link to="/programs" className="btn btn-primary btn-sm">
                <PlusCircle size={15} />
                Explore & Apply
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                      {app.program?.title || 'Degree Program'}
                    </h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {app.university?.name || 'University'} • {app.university?.country || ''}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Profile Summary & Action Panel */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} style={{ color: 'var(--secondary)' }} />
            Profile Preference Summary
          </h3>

          <div
            style={{
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.875rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Country:</span>
              <strong>{user?.preferredCountry || 'Not Specified'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Field of Interest:</span>
              <strong>{user?.preferredField || 'Not Specified'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Annual Tuition Budget:</span>
              <strong style={{ color: 'var(--accent-emerald)' }}>
                {user?.budget ? `$${user.budget.toLocaleString()}` : 'Flexible'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>IELTS Band:</span>
              <strong style={{ color: '#a5b4fc' }}>{user?.ieltsScore || 'Not Entered'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Intake:</span>
              <strong>{user?.preferredIntake || 'Fall 2026'}</strong>
            </div>
          </div>

          <Link to="/profile" className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }}>
            Update Profile & Preferences
          </Link>
        </div>
      </div>

      {/* Recommended Programs Row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
            Top Recommendations For You
          </h3>
          <Link to="/recommendations" style={{ color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 600 }}>
            Open Recommendation Studio
          </Link>
        </div>

        {loading ? (
          <Loader message="Fetching recommended programs..." />
        ) : recommendations.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Update your study preferences in your profile to get personalized recommendations.</p>
          </div>
        ) : (
          <div className="grid-3">
            {recommendations.slice(0, 3).map((rec, index) => (
              <ProgramCard
                key={rec._id || index}
                program={rec.program || rec}
                onSelect={() => navigate('/recommendations')}
                onApply={() => navigate('/programs')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
