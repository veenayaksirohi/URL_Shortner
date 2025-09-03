import { API_ENDPOINTS, ERROR_MESSAGES, STORAGE_KEYS } from '../utils/constants';
import { getToken, logout, checkTokenExpiration } from '../utils/auth';

// Get API base URL from localStorage or use default
const getApiBaseUrl = () => {
  return localStorage.getItem(STORAGE_KEYS.API_BASE_URL) || 'http://210.79.129.154:3000';
};

// Set API base URL
export const setApiBaseUrl = (url) => {
  localStorage.setItem(STORAGE_KEYS.API_BASE_URL, url);
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  // Check token expiration before making request
  if (checkTokenExpiration()) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization header if token exists
  const token = getToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle different HTTP status codes
    if (response.status === 401) {
      logout();
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (response.status === 403) {
      throw new Error('Access denied');
    }

    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    if (response.status === 409) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Conflict error');
    }

    if (response.status >= 500) {
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  register: async (userData) => {
    return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// URL API calls
export const urlAPI = {
  shorten: async (url) => {
    return apiRequest(API_ENDPOINTS.URL.SHORTEN, {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  getUrls: async () => {
    return apiRequest(API_ENDPOINTS.URL.LIST);
  },

  deleteUrl: async (id) => {
    return apiRequest(API_ENDPOINTS.URL.DELETE(id), {
      method: 'DELETE',
    });
  },
};

// Utility function to test API connection
export const testConnection = async () => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};