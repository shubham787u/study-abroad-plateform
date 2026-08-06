// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Supported Countries
export const COUNTRIES = [
  { value: 'USA', label: 'United States (USA)' },
  { value: 'UK', label: 'United Kingdom (UK)' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Ireland', label: 'Ireland' },
];

// Fields of Study
export const FIELDS_OF_STUDY = [
  { value: 'Computer Science', label: 'Computer Science & IT' },
  { value: 'Business Analytics', label: 'Business & Management' },
  { value: 'Data Science', label: 'Data Science & AI' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Finance', label: 'Finance & Economics' },
  { value: 'Medicine', label: 'Medicine & Healthcare' },
  { value: 'Law', label: 'Law & Legal Studies' },
  { value: 'Arts', label: 'Arts & Design' },
];

// Application Statuses
export const APPLICATION_STATUSES = ['Applied', 'Reviewed', 'Accepted', 'Rejected'];

// Intake Seasons
export const INTAKE_OPTIONS = [
  { value: 'Fall 2025', label: 'Fall 2025' },
  { value: 'Spring 2026', label: 'Spring 2026' },
  { value: 'Summer 2026', label: 'Summer 2026' },
  { value: 'Fall 2026', label: 'Fall 2026' },
  { value: 'Spring 2027', label: 'Spring 2027' },
  { value: 'Summer 2027', label: 'Summer 2027' },
];

// Degree Levels
export const DEGREE_LEVELS = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

// Sort Options for Programs
export const SORT_OPTIONS = [
  { value: 'fee-asc', label: 'Tuition Fee: Low to High' },
  { value: 'fee-desc', label: 'Tuition Fee: High to Low' },
  { value: 'title-asc', label: 'Program Title: A to Z' },
  { value: 'createdAt-desc', label: 'Newest First' },
];

// IELTS Score Options
export const IELTS_OPTIONS = [
  { value: '6.0', label: '6.0 or lower' },
  { value: '6.5', label: '6.5 or lower' },
  { value: '7.0', label: '7.0 or lower' },
  { value: '7.5', label: '7.5 or lower' },
  { value: '8.0', label: '8.0 or lower' },
];

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  COUNSELOR: 'counselor',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};
