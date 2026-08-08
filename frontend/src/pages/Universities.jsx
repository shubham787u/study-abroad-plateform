import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import universityService from '../services/universityService';
import SearchBar from '../components/SearchBar';
import UniversityCard from '../components/UniversityCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { Landmark, MapPin, Award } from 'lucide-react';

const Universities = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('ranking');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 6, sortBy, order };
      if (country) params.country = country;
      if (search) params.search = search;

      const res = await universityService.getUniversities(params);
      if (res?.data) setUniversities(res.data);
      if (res?.meta) setMeta(res.meta);
    } catch (err) {
      console.error('Failed to fetch universities:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [country, search, sortBy, order, page]);

  const handleCountryFilter = (selectedCountry) => {
    setCountry(selectedCountry);
    setPage(1);
  };

  const handleSearchSubmit = (term) => {
    setSearch(term);
    setPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Global University Directory</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Explore world-renowned educational institutions, rankings, and global campus locations.
        </p>
      </div>

      {/* Country Filter Chips & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ maxWidth: '600px' }}>
          <SearchBar onSearch={handleSearchSubmit} placeholder="Search university by name..." />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {['', 'USA', 'UK', 'Canada', 'Australia', 'Germany'].map((c) => (
            <button
              key={c || 'all'}
              className={`btn btn-sm ${country === c ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleCountryFilter(c)}
            >
              {c === '' ? 'All Destinations' : c}
            </button>
          ))}
        </div>
      </div>

      {/* University Grid */}
      {loading ? (
        <Loader message="Loading universities..." />
      ) : universities.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Landmark size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
          <h3>No Universities Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try broadening your search term or country filter.</p>
        </div>
      ) : (
        <>
          <div className="grid-3">
            {universities.map((univ) => (
              <UniversityCard
                key={univ._id}
                university={univ}
                onViewPrograms={(u) => navigate(`/programs?country=${encodeURIComponent(u.country)}`)}
              />
            ))}
          </div>

          <Pagination meta={meta} onPageChange={(newPage) => setPage(newPage)} />
        </>
      )}
    </div>
  );
};

export default Universities;
