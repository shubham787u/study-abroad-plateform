import React from 'react';
import { Sparkles, GraduationCap, MapPin, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

const RecommendationCard = ({ recommendation, onApply }) => {
  // Recommendation objects may come as { program, matchScore, reasons, isEligible } or raw program
  const program = recommendation?.program || recommendation;
  const matchScore = recommendation?.matchScore || recommendation?.score || 92;
  const reasons = recommendation?.reasons || [
    'Matches your target study destination',
    'Fits within your annual budget',
    'IELTS requirement satisfied',
  ];

  const universityName = program?.university?.name || 'Top Global University';
  const country = program?.university?.country || 'Destination Country';
  const feeFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: program?.currency || 'USD',
    maximumFractionDigits: 0,
  }).format(program?.fee || 0);

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.825rem',
            fontWeight: 700,
            color: '#a5b4fc',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--secondary)' }} />
          {matchScore}% Profile Match
        </div>

        <span style={{ fontSize: '0.825rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
          <MapPin size={13} />
          {country}
        </span>
      </div>

      <h3 style={{ fontSize: '1.15rem', lineHeight: '1.35', marginBottom: '0.35rem' }}>{program?.title}</h3>

      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <GraduationCap size={15} style={{ color: 'var(--secondary)' }} />
        <span>{universityName}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          padding: '0.75rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          fontSize: '0.775rem',
          textAlign: 'center',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Fee</span>
          <strong style={{ color: 'var(--text-main)' }}>{feeFormatted}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Min IELTS</span>
          <strong style={{ color: '#a5b4fc' }}>{program?.minIeltsScore || 6.0}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block' }}>Intake</span>
          <strong style={{ color: 'var(--text-muted)' }}>{program?.intake || 'Fall'}</strong>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem', flex: 1 }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
          Match Insights
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {Array.isArray(reasons) &&
            reasons.map((reason, idx) => (
              <li key={idx} style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <CheckCircle size={14} style={{ color: 'var(--accent-emerald)', marginTop: '0.15rem', flexShrink: 0 }} />
                <span>{reason}</span>
              </li>
            ))}
        </ul>
      </div>

      <button
        className="btn btn-primary btn-sm"
        onClick={() => onApply && onApply(program)}
        style={{ marginTop: 'auto', width: '100%' }}
      >
        Apply to Recommended Program
        <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default RecommendationCard;
