import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import recommendationService from '../services/recommendationService';
import applicationService from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';
import Loader from '../components/Loader';
import {
  Sparkles,
  SlidersHorizontal,
  UserCheck,
  Globe,
  BookOpen,
  DollarSign,
  Award,
  Calendar,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const Recommendations = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'custom'
  const [recommendations, setRecommendations] = useState([]);
  const [appliedPreferences, setAppliedPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Custom simulation form state
  const [customParams, setCustomParams] = useState({
    country: user?.preferredCountry || 'USA',
    field: user?.preferredField || 'Computer Science',
    budget: user?.budget ? String(user.budget) : '35000',
    ieltsScore: user?.ieltsScore ? String(user.ieltsScore) : '7.0',
    intake: user?.preferredIntake || 'Fall 2026',
  });

  // Application Modal state
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [applying, setApplying] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const fetchProfileRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      if (!isAuthenticated) {
        // Fall back to custom matcher if unauthenticated
        setActiveTab('custom');
        runCustomMatch();
        return;
      }
      const res = await recommendationService.getUserProfileRecommendations();
      if (res?.data) setRecommendations(res.data);
      if (res?.meta?.appliedPreferences) setAppliedPreferences(res.meta.appliedPreferences);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const runCustomMatch = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const payload = {
        country: customParams.country,
        field: customParams.field,
        budget: Number(customParams.budget) || 0,
        ieltsScore: Number(customParams.ieltsScore) || 0,
        intake: customParams.intake,
      };

      const res = await recommendationService.getCustomRecommendations(payload);
      if (res?.data) setRecommendations(res.data);
      if (res?.meta?.appliedPreferences) setAppliedPreferences(res.meta.appliedPreferences);
    } catch (err) {
      setError(err.message || 'Failed to generate custom recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProfileRecommendations();
    } else {
      runCustomMatch();
    }
  }, [activeTab]);

  const handleApplyClick = (program) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedProgram(program);
    setStatementOfPurpose('');
    setModalError('');
    setModalSuccess('');
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);
      setModalError('');
      setModalSuccess('');

      await applicationService.applyToProgram({
        programId: selectedProgram._id,
        statementOfPurpose,
      });

      setModalSuccess('Application submitted successfully!');
      setTimeout(() => {
        setSelectedProgram(null);
        navigate('/applications');
      }, 1500);
    } catch (err) {
      setModalError(err.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sparkles size={28} style={{ color: 'var(--secondary)' }} />
            AI Program Recommendation Engine
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Smart algorithmic matching based on destination country, tuition budget, IELTS eligibility, and academic field.
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(30, 41, 59, 0.8)', padding: '0.35rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCheck size={15} />
            Profile Match
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'custom' ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setActiveTab('custom')}
          >
            <SlidersHorizontal size={15} />
            Custom Simulator
          </button>
        </div>
      </div>

      {/* Custom Match Form Panel */}
      {activeTab === 'custom' && (
        <form onSubmit={runCustomMatch} className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <SlidersHorizontal size={18} />
            Customize Match Criteria
          </h3>

          <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <Globe size={14} /> Country
              </label>
              <select
                className="form-control"
                value={customParams.country}
                onChange={(e) => setCustomParams({ ...customParams, country: e.target.value })}
              >
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <BookOpen size={14} /> Field of Study
              </label>
              <select
                className="form-control"
                value={customParams.field}
                onChange={(e) => setCustomParams({ ...customParams, field: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Business Analytics">Business Analytics</option>
                <option value="Data Science">Data Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <DollarSign size={14} /> Annual Budget (USD)
              </label>
              <input
                type="number"
                className="form-control"
                value={customParams.budget}
                onChange={(e) => setCustomParams({ ...customParams, budget: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award size={14} /> Your IELTS Score
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                className="form-control"
                value={customParams.ieltsScore}
                onChange={(e) => setCustomParams({ ...customParams, ieltsScore: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} /> Intake Season
              </label>
              <select
                className="form-control"
                value={customParams.intake}
                onChange={(e) => setCustomParams({ ...customParams, intake: e.target.value })}
              >
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Summer 2026">Summer 2026</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-accent" style={{ width: '100%', height: '44px' }}>
                <Sparkles size={16} />
                Generate Match
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Applied Criteria Summary Bar */}
      {appliedPreferences && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
          }}
        >
          <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Applied Match Parameters:</span>
          <span>Country: <strong>{appliedPreferences.preferredCountry || 'Any'}</strong></span>
          <span>Field: <strong>{appliedPreferences.preferredField || 'Any'}</strong></span>
          <span>Budget: <strong>${Number(appliedPreferences.budget || 0).toLocaleString()}</strong></span>
          <span>IELTS: <strong>{appliedPreferences.ieltsScore || 'Any'}</strong></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Recommendations Results Grid */}
      {loading ? (
        <Loader message="Calculating AI match compatibility scores..." />
      ) : recommendations.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
          <h3>No Match Results Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try adjusting your target country or increasing your tuition budget.</p>
        </div>
      ) : (
        <div className="grid-3">
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec._id || index}
              recommendation={rec}
              onApply={handleApplyClick}
            />
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedProgram && (
        <div className="modal-overlay" onClick={() => setSelectedProgram(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProgram(null)}>
              <X size={20} />
            </button>

            <span className="badge badge-accepted" style={{ marginBottom: '0.75rem' }}>
              Top AI Match
            </span>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedProgram.title}</h2>
            <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {selectedProgram.university?.name} ({selectedProgram.university?.country})
            </p>

            {modalError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label className="form-label">Statement of Purpose (SOP)</label>
                <textarea
                  className="form-control"
                  placeholder="Share your academic background and reasons for applying..."
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setSelectedProgram(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
