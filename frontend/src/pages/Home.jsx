import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import UniversityCard from '../components/UniversityCard';
import ProgramCard from '../components/ProgramCard';
import Loader from '../components/Loader';
import universityService from '../services/universityService';
import programService from '../services/programService';
import {
  Sparkles,
  GraduationCap,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Compass,
  ArrowRight,
  Landmark,
  BookOpen,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [univRes, progRes] = await Promise.all([
          universityService.getUniversities({ limit: 3, sortBy: 'ranking', order: 'asc' }),
          programService.getPrograms({ limit: 3 }),
        ]);

        if (univRes?.data) setFeaturedUniversities(univRes.data);
        if (progRes?.data) setFeaturedPrograms(progRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term) => {
    if (term.trim()) {
      navigate(`/programs?search=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      {/* Hero Section */}
      <section className="hero-banner">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <Sparkles size={15} style={{ color: 'var(--secondary)' }} />
          Smart University & Program Recommendation Platform
        </div>

        <h1 className="hero-title">
          Your Gateway to <span className="gradient-text">Global Education</span>
        </h1>

        <p className="hero-subtitle">
          Discover top-tier degree programs, compare tuition & IELTS requirements across USA, UK, Canada & Australia, and apply with confidence.
        </p>

        <div style={{ maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
          <SearchBar onSearch={handleSearch} placeholder="Search by degree title, field (ex-Computer Science) or university" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/recommendations" className="btn btn-accent btn-lg">
            <Sparkles size={18} />
            Try Program Matcher
          </Link>
          <Link to="/programs" className="btn btn-secondary btn-lg">
            <BookOpen size={18} />
            Explore All Programs
          </Link>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section
        className="glass-card"
        style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div>
          <h3 style={{ fontSize: '2.25rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>50+</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Top Universities</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2.25rem', color: 'var(--secondary)', marginBottom: '0.2rem' }}>200+</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Accredited Programs</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2.25rem', color: 'var(--accent-emerald)', marginBottom: '0.2rem' }}>98%</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Recommendation Precision</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2.25rem', color: 'var(--accent-amber)', marginBottom: '0.2rem' }}>$0</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Hidden Platform Fees</p>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Everything You Need To Study Abroad</h2>
          <p style={{ color: 'var(--text-muted)' }}>Empowering international students at every step of their academic journey.</p>
        </div>

        <div className="grid-3">
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>AI Program Matcher</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Input your target country, annual budget, and IELTS score to get algorithmic program recommendations tailored to your goals.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Globe2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Global University Catalog</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Filter programs by tuition fees, intake seasons, degree levels, and world rankings.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Application Tracker</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Submit your Statement of Purpose directly and track application progress from 'Applied' to 'Accepted' in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Featured Programs</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Explore top trending degree courses across the globe</p>
          </div>
          <Link to="/programs" className="btn btn-secondary btn-sm">
            View All Programs
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading featured programs..." />
        ) : (
          <div className="grid-3">
            {featuredPrograms.map((program) => (
              <ProgramCard
                key={program._id}
                program={program}
                onSelect={() => navigate(`/programs`)}
                onApply={() => navigate(`/programs`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Universities Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem' }}>Premier Universities</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Top ranked institutions looking for international talent</p>
          </div>
          <Link to="/universities" className="btn btn-secondary btn-sm">
            View All Universities
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading universities..." />
        ) : (
          <div className="grid-3">
            {featuredUniversities.map((university) => (
              <UniversityCard
                key={university._id}
                university={university}
                onViewPrograms={() => navigate(`/programs?country=${encodeURIComponent(university.country)}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
