export const APP_NAME = 'CADQM';
export const APP_VERSION = process.env.REACT_APP_VERSION || '0.1.0';

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),
};

export const AUTH_CONFIG = {
  TOKEN_KEY: process.env.REACT_APP_AUTH_TOKEN_KEY || 'cadqm_auth_token',
  REFRESH_TOKEN_KEY: process.env.REACT_APP_AUTH_REFRESH_TOKEN_KEY || 'cadqm_refresh_token',
};

export const FILE_CONFIG = {
  MAX_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '5242880', 10), // 5MB
  SUPPORTED_TYPES: (process.env.REACT_APP_SUPPORTED_FILE_TYPES || '.csv,.xlsx,.xls').split(','),
};

export const ROUTES = {
  // Main routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROJECTS: '/projects',
  SERVER_ERROR: '/server-error',

  // Project routes
  PROJECT_CONTEXT: '/projects/:projectId/context',
  PROJECT_PDF: '/projects/:projectId/pdf',

  // Stage routes
  STAGE_1: '/projects/:projectId/st1',
  STAGE_2: '/projects/:projectId/st2',
  STAGE_3: '/projects/:projectId/st3',

  // Stage 1 activities
  ST1_A01: 'a01',
  ST1_A02: 'a02',
  ST1_A03: 'a03',
  ST1_A04: 'a04',

  // Stage 2 activities
  ST2_A03: 'a03',
  ST2_A05: 'a05',
  ST2_A06: 'a06',
  ST2_A07: 'a07',

  // Stage 3 activities
  ST3_A03: 'a03',
  ST3_A07: 'a07',
  ST3_A08: 'a08',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login/',
    LOGOUT: '/auth/logout',
    REGISTER: '/register/',
    REFRESH: '/token/refresh/',
  },

  // Project endpoints
  PROJECTS: 'projects/',

  // Context component endpoints
  CONTEXT: {
    APPLICATION_DOMAIN: 'application-domains/',
    BUSINESS_RULE: 'business-rules/',
    DATA_FILTERING: 'data-filterings/',
    DQ_METADATA: 'dq-metadata/',
    DQ_REQUIREMENT: 'dq-requirements/',
    OTHER_DATA: 'other-data/',
    OTHER_METADATA: 'other-metadata/',
    SYSTEM_REQUIREMENT: 'system-requirements/',
    TASK_AT_HAND: 'task-at-hand/',
    USER_TYPE: 'user-types/',
  },

  // Data quality endpoints
  DATA_QUALITY: {
    PROBLEMS: 'quality-problems/',
  },

  // Data handling endpoints
  DATA: {
    AT_HAND: 'data-at-hand/',
    PROFILING: 'data-profiling/',
  },

  // File management endpoints
  FILES: {
    TYPES: 'file-types/',
  },

  // Estimation endpoints
  ESTIMATION: 'estimations/',

  // Review endpoints
  REVIEWS: 'reviews/',
};
