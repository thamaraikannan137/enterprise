// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// App Configuration
export const APP_NAME = 'Your App Name';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  USERS: '/v1/users',
  EMPLOYEES: '/v1/employees',
  EMPLOYEE_CONTACTS: '/v1/employee-contacts',
  EMPLOYEE_COMPENSATION: '/v1/employee-compensation',
  EMPLOYEE_DOCUMENTS: '/v1/employee-documents',
  WORK_PASSES: '/v1/work-passes',
  CERTIFICATIONS: '/v1/certifications',
  QUALIFICATIONS: '/v1/qualifications',
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    REGISTER: '/v1/auth/register',
  },
} as const;

