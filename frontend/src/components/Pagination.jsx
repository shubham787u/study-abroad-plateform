import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, totalDocs, limit } = meta;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalDocs);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Showing <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{startItem}</span> to{' '}
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{endItem}</span> of{' '}
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{totalDocs}</span> results
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span
          style={{
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.05)',
            fontSize: '0.875rem',
            fontWeight: 600,

            color: 'var(--text-main)',
          }}
        >
          {page} / {totalPages}
        </span>

        <button
          className="btn btn-secondary btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
