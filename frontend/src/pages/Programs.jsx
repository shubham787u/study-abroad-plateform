import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import programService from '../services/programService';
import applicationService from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import ProgramCard from '../components/ProgramCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import {
  GraduationCap,
  Filter,
  X,
  MapPin,
  DollarSign,
  Award,
  Calendar,
  BookOpen,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const Programs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [programs, setPrograms] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State synced with searchParams
  const [filters, setFilters] = useState({
    country: searchParams.get('country') || '',
    field: searchParams.get('field') || '',
    intake: searchParams.get('intake') || '',
    maxFee: searchParams.get('maxFee') || '',
    minIelts: searchParams.get('minIelts') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'fee',
    order: searchParams.get('order') || 'asc',
    page: searchParams.get('page') || 1,
  });

  // Modal State for Program Details & Application
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [applying, setApplying] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.country) params.country = filters.country;
      if (filters.field) params.field = filters.field;
      if (filters.intake) params.intake = filters.intake;
      if (filters.maxFee) params.maxFee = filters.maxFee;
      if (filters.minIelts) params.minIelts = filters.minIelts;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.order) params.order = filters.order;
      params.page = filters.page;
      params.limit = 6;

      const res = await programService.getPrograms(params);
      if (res?.data) setPrograms(res.data);
      if (res?.meta) setMeta(res.meta);
    } catch (err) {
      console.error('Failed to load programs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value, page: 1 };
    setFilters(updated);

    // Sync to URL
    const newParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (searchTerm) => {
    handleFilterChange('search', searchTerm);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      country: '',
      field: '',
      intake: '',
      maxFee: '',
      minIelts: '',
      search: '',
      sortBy: 'fee',
      order: 'asc',
      page: 1,
    });
    setSearchParams({});
  };

  const openProgramModal = (program) => {
    setSelectedProgram(program);
    setStatementOfPurpose('');
    setModalError('');
    setModalSuccess('');
  };

  const closeModal = () => {
    setSelectedProgram(null);
    setModalError('');
    setModalSuccess('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      setModalError('');
      setModalSuccess('');

      await applicationService.applyToProgram({
        programId: selectedProgram._id,
        statementOfPurpose,
      });

      setModalSuccess('Application submitted successfully! Track status in your Dashboard.');
      setTimeout(() => {
        closeModal();
        navigate('/applications');
      }, 1500);
    } catch (err) {
      setModalError(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Degree Programs Catalog</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse international Bachelor's, Master's & PhD programs with real-time tuition and entry requirements.
        </p>
      </div>

      {/* Main Catalog Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={18} style={{ color: 'var(--primary)' }} />
              Filter Programs
            </h3>
            <button
              type="button"
              onClick={resetFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Reset All
            </button>
          </div>

          {/* Country Filter */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={14} /> Destination Country
            </label>
            <select
              className="form-control"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">All Countries</option>
              <option value="USA">United States (USA)</option>
              <option value="UK">United Kingdom (UK)</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          {/* Field Filter */}
          <div className="form-group">
            <label className="form-label">
              <BookOpen size={14} /> Field of Study
            </label>
            <select
              className="form-control"
              value={filters.field}
              onChange={(e) => handleFilterChange('field', e.target.value)}
            >
              <option value="">All Fields</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business Analytics">Business Analytics</option>
              <option value="Data Science">Data Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Intake Filter */}
          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} /> Intake Season
            </label>
            <select
              className="form-control"
              value={filters.intake}
              onChange={(e) => handleFilterChange('intake', e.target.value)}
            >
              <option value="">All Intakes</option>
              <option value="Fall">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
          </div>

          {/* Max Fee Filter */}
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={14} /> Max Tuition Fee (USD)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 35000"
              value={filters.maxFee}
              onChange={(e) => handleFilterChange('maxFee', e.target.value)}
            />
          </div>

          {/* Min IELTS Filter */}
          <div className="form-group">
            <label className="form-label">
              <Award size={14} /> Min IELTS Score
            </label>
            <select
              className="form-control"
              value={filters.minIelts}
              onChange={(e) => handleFilterChange('minIelts', e.target.value)}
            >
              <option value="">Any IELTS Score</option>
              <option value="6.0">6.0 or lower</option>
              <option value="6.5">6.5 or lower</option>
              <option value="7.0">7.0 or lower</option>
              <option value="7.5">7.5 or lower</option>
            </select>
          </div>

          {/* Sort Config */}
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select
              className="form-control"
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sb, ord] = e.target.value.split('-');
                handleFilterChange('sortBy', sb);
                handleFilterChange('order', ord);
              }}
            >
              <option value="fee-asc">Tuition Fee: Low to High</option>
              <option value="fee-desc">Tuition Fee: High to Low</option>
              <option value="title-asc">Program Title: A to Z</option>
              <option value="createdAt-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Right Main Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Search Header Bar */}
          <SearchBar onSearch={handleSearchSubmit} placeholder="Search program titles or university names" />

          {/* Results Display */}
          {loading ? (
            <Loader message="Fetching matching academic programs..." />
          ) : programs.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <GraduationCap size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
              <h3>No Programs Match Your Criteria</h3>
              <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>Try clearing filters or searching with different keywords.</p>
              <button className="btn btn-primary btn-sm" onClick={resetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid-2">
                {programs.map((program) => (
                  <ProgramCard
                    key={program._id}
                    program={program}
                    onSelect={openProgramModal}
                    onApply={openProgramModal}
                  />
                ))}
              </div>

              <Pagination meta={meta} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>

      {/* Detail & Application Modal */}
      {selectedProgram && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={20} />
            </button>

            <span className="badge badge-applied" style={{ marginBottom: '0.75rem' }}>
              {selectedProgram.degreeLevel || 'Master'}
            </span>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedProgram.title}</h2>
            <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {selectedProgram.university?.name} ({selectedProgram.university?.country})
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Tuition Fee</span>
                <strong>${selectedProgram.fee?.toLocaleString()} USD</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Min IELTS</span>
                <strong style={{ color: '#a5b4fc' }}>{selectedProgram.minIeltsScore || 6.0}+</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Intake</span>
                <strong>{selectedProgram.intake || 'Fall'}</strong>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {selectedProgram.description}
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

            <form onSubmit={handleApplySubmit}>
              <div className="form-group">
                <label className="form-label">Statement of Purpose / Application Note</label>
                <textarea
                  className="form-control"
                  placeholder="Explain why you are an ideal candidate for this program..."
                  value={statementOfPurpose}
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={applying}>
                  {applying ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
