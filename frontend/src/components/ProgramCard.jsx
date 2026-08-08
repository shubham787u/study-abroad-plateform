import React from 'react';
import { GraduationCap, MapPin, DollarSign, Calendar, BookOpen, Award, ArrowRight } from 'lucide-react';

const ProgramCard = ({ program, onSelect, onApply }) => {
  const universityName = program?.university?.name || 'Top University';
  const country = program?.university?.country || 'Global';
  const feeFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: program?.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(program?.fee || 0);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'rgba(99, 102, 241, 0.12)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          {program?.degreeLevel || 'Master'}
        </span>
        <span
          style={{
            fontSize: '0.825rem',
            fontWeight: 600,
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <MapPin size={14} />
          {country}
        </span>
      </div>

      <h3 style={{ fontSize: '1.15rem', lineHeight: '1.35', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
        {program?.title}
      </h3>

      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <GraduationCap size={15} style={{ color: 'var(--secondary)' }} />
        <span style={{ fontWeight: 500 }}>{universityName}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          padding: '0.85rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem',
          fontSize: '0.825rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Annual Fee</span>
          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{feeFormatted}</strong>
        </div>

        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Min IELTS</span>
          <strong style={{ color: '#a5b4fc', fontSize: '0.95rem' }}>{program?.minIeltsScore || '6.0'}+</strong>
        </div>

        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Intake</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{program?.intake || 'Fall'}</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', fontSize: '0.75rem' }}>Duration</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{program?.durationYears ? `${program.durationYears} Years` : '2 Years'}</span>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {program?.description || 'Explore this world-class academic curriculum designed to accelerate international careers.'}
      </p>

      <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto' }}>
        {onSelect && (
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => onSelect(program)}>
            Details
          </button>
        )}
        {onApply && (
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onApply(program)}>
            Apply Now
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramCard;
