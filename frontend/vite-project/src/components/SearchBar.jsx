import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search programs, universities, countries...' }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleClear = () => {
    setTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        style={{
          paddingLeft: '2.75rem',
          paddingRight: term ? '2.5rem' : '1rem',
          borderRadius: 'var(--radius-md)',
          height: '46px',
        }}
      />
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-subtle)',
        }}
      />
      {term && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.2rem',
          }}
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
