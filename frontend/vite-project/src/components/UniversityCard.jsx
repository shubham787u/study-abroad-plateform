import React from 'react';
import { Landmark, MapPin, Award, ExternalLink, ArrowRight } from 'lucide-react';

const UniversityCard = ({ university, onViewPrograms }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontSize: '1.25rem',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {university?.logoUrl ? (
            <img src={university.logoUrl} alt={university.name} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
          ) : (
            <Landmark size={24} />
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', lineHeight: '1.3' }}>{university?.name}</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} style={{ color: 'var(--secondary)' }} />
            {university?.location ? `${university.location}, ` : ''}{university?.country}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.85rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          fontSize: '0.825rem',
        }}
      >
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Award size={14} style={{ color: 'var(--accent-amber)' }} />
          World Rank
        </span>
        <strong style={{ color: 'var(--accent-amber)', fontSize: '0.95rem' }}>#{university?.ranking || 'Top 100'}</strong>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', flex: 1, lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {university?.description || 'Premier higher education institution offering globally accredited degrees and world-class research facilities.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
        {university?.website ? (
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.825rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}
          >
            Official Website
            <ExternalLink size={12} />
          </a>
        ) : (
          <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)' }}>Verified Campus</span>
        )}

        {onViewPrograms && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onViewPrograms(university)}
            style={{ gap: '0.35rem' }}
          >
            Explore Programs
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UniversityCard;
