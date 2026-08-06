import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Globe,
  BookOpen,
  DollarSign,
  Award,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  UserCircle,
  Edit3,
  Shield,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    preferredCountry: '',
    preferredField: '',
    budget: '',
    ieltsScore: '',
    preferredIntake: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Populate form from user context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        preferredCountry: user.preferredCountry || '',
        preferredField: user.preferredField || '',
        budget: user.budget ? String(user.budget) : '',
        ieltsScore: user.ieltsScore ? String(user.ieltsScore) : '',
        preferredIntake: user.preferredIntake || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await updateUserProfile({
        name: formData.name,
        preferredCountry: formData.preferredCountry,
        preferredField: formData.preferredField,
        budget: Number(formData.budget) || 0,
        ieltsScore: Number(formData.ieltsScore) || 0,
        preferredIntake: formData.preferredIntake,
      });

      setSuccess('Profile updated successfully! Your AI recommendations will now reflect these preferences.');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        preferredCountry: user.preferredCountry || '',
        preferredField: user.preferredField || '',
        budget: user.budget ? String(user.budget) : '',
        ieltsScore: user.ieltsScore ? String(user.ieltsScore) : '',
        preferredIntake: user.preferredIntake || '',
      });
    }
    setIsEditing(false);
    setError('');
  };

  const getRoleColor = (role) => {
    if (role === 'admin') return 'var(--accent-rose)';
    if (role === 'counselor') return 'var(--accent-amber)';
    return 'var(--primary)';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.25rem',
            fontWeight: 800,
            flexShrink: 0,
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem' }}>{user?.name || 'Student Profile'}</h1>
            <span
              className="badge"
              style={{
                background: `rgba(${getRoleColor(user?.role) === 'var(--primary)' ? '99, 102, 241' : '245, 158, 11'}, 0.15)`,
                color: getRoleColor(user?.role),
                border: `1px solid ${getRoleColor(user?.role)}40`,
                textTransform: 'uppercase',
              }}
            >
              <Shield size={11} />
              {user?.role || 'student'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Mail size={15} style={{ color: 'var(--secondary)' }} />
            {user?.email || 'email@example.com'}
          </div>

          <p style={{ color: 'var(--text-subtle)', fontSize: '0.825rem', marginTop: '0.35rem' }}>
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
          </p>
        </div>

        <button
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
        >
          <Edit3 size={15} />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
          <UserCircle size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem' }}>Personal Information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Info Section */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                <User size={14} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                disabled={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.7 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={14} />
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Email cannot be changed</span>
            </div>
          </div>

          {/* Study Preferences Section */}
          <div
            style={{
              marginTop: '1.5rem',
              marginBottom: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Globe size={18} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Study Abroad Preferences</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Used for AI Program Matching)</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                <Globe size={14} />
                Preferred Country
              </label>
              <select
                name="preferredCountry"
                className="form-control"
                value={formData.preferredCountry}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.7 }}
              >
                <option value="">— Select Destination —</option>
                <option value="USA">United States (USA)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Ireland">Ireland</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <BookOpen size={14} />
                Preferred Field of Study
              </label>
              <select
                name="preferredField"
                className="form-control"
                value={formData.preferredField}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.7 }}
              >
                <option value="">— Select Field —</option>
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Business Analytics">Business & Management</option>
                <option value="Data Science">Data Science & AI</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance & Economics</option>
                <option value="Medicine">Medicine & Healthcare</option>
                <option value="Law">Law & Legal Studies</option>
                <option value="Arts">Arts & Design</option>
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">
                <DollarSign size={14} />
                Annual Budget (USD)
              </label>
              <input
                type="number"
                name="budget"
                className="form-control"
                placeholder="e.g. 35000"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                disabled={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.7 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award size={14} />
                IELTS Band Score
              </label>
              <input
                type="number"
                name="ieltsScore"
                className="form-control"
                placeholder="e.g. 7.0"
                value={formData.ieltsScore}
                onChange={handleChange}
                step="0.5"
                min="0"
                max="9"
                disabled={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.7 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} />
                Target Intake
              </label>
              <select
                name="preferredIntake"
                className="form-control"
                value={formData.preferredIntake}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ opacity: isEditing ? 1 : 0.7 }}
              >
                <option value="">— Select Intake —</option>
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Summer 2026">Summer 2026</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Summer 2027">Summer 2027</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={handleCancel}
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} />
                    Save Profile Updates
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Preference Summary Card */}
      {!isEditing && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--accent-amber)' }} />
            Your AI Match Profile Summary
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
            }}
          >
            {[
              { label: 'Target Country', value: user?.preferredCountry || 'Not Set', color: 'var(--secondary)' },
              { label: 'Field of Study', value: user?.preferredField || 'Not Set', color: 'var(--primary)' },
              { label: 'Annual Budget', value: user?.budget ? `$${user.budget.toLocaleString()}` : 'Flexible', color: 'var(--accent-emerald)' },
              { label: 'IELTS Score', value: user?.ieltsScore ? `${user.ieltsScore} Band` : 'Not Entered', color: '#a5b4fc' },
              { label: 'Target Intake', value: user?.preferredIntake || 'Any Intake', color: 'var(--accent-amber)' },
              { label: 'Role', value: user?.role || 'Student', color: 'var(--accent-rose)' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {item.label}
                </span>
                <strong style={{ color: item.color, fontSize: '0.95rem' }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
