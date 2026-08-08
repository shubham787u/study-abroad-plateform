/**
 * Format a number as currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Format a date string to human-readable format
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};

/**
 * Truncate text to a specific max length
 */
export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get badge class name based on application status
 */
export const getStatusBadgeClass = (status) => {
  const map = {
    Applied: 'badge-applied',
    Reviewed: 'badge-reviewed',
    Accepted: 'badge-accepted',
    Rejected: 'badge-rejected',
  };
  return map[status] || 'badge-neutral';
};

/**
 * Format budget as compact string
 */
export const formatBudget = (budget) => {
  if (!budget) return 'Flexible';
  if (budget >= 1000) return `$${(budget / 1000).toFixed(0)}K`;
  return `$${budget}`;
};

/**
 * Simple debounce utility
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Convert object to URL query string (filtering empty values)
 */
export const buildQueryString = (params = {}) => {
  return Object.entries(params)
    .filter(([, val]) => val !== '' && val !== null && val !== undefined)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&');
};
