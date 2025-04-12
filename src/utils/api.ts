import { toast } from 'react-toastify';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

// API URL utility
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    ME: `${API_URL}/auth/me`,
  },
  SETTINGS: {
    PROFILE: `${API_URL}/settings/profile`,
    ADMIN_PROFILE: `${API_URL}/settings/admin-profile`,
    PROFILE_IMAGE: `${API_URL}/settings/profile-image`,
  },
  CONTACT: {
    ADMIN: `${API_URL}/contact/admin`,
    MARK_READ: (id: string) => `${API_URL}/contact/admin/${id}/read`,
    DELETE: (id: string) => `${API_URL}/contact/admin/${id}`,
  },
  SKILLS: {
    ADMIN: `${API_URL}/skills/admin`,
    DELETE: (id: string) => `${API_URL}/skills/${id}`,
  },
  CATEGORIES: {
    ADMIN: `${API_URL}/categories/admin`,
  },
  ANALYTICS: {
    BASE: `${API_URL}/analytics`,
  },
};

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/skills',
  '/projects',
  '/categories',
  '/contact',
  '/auth/login',
  '/auth/register'
];

const isPublicEndpoint = (endpoint: string) => {
  return PUBLIC_ENDPOINTS.some(publicEndpoint => endpoint.startsWith(publicEndpoint));
};

const getHeaders = (endpoint: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add Authorization header for non-public endpoints
  if (!isPublicEndpoint(endpoint)) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(endpoint),
      });

      if (!response.ok) {
        if (response.status === 401 && !isPublicEndpoint(endpoint)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      const data = await response.json();
      return { data };
    } catch (error: any) {
      console.error(`API Error (GET ${endpoint}):`, error);
      toast.error(error.message || 'An error occurred');
      return { error: error.message };
    }
  },

  post: async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(endpoint),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401 && !isPublicEndpoint(endpoint)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      const data = await response.json();
      return { data };
    } catch (error: any) {
      console.error(`API Error (POST ${endpoint}):`, error);
      toast.error(error.message || 'An error occurred');
      return { error: error.message };
    }
  },

  put: async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(endpoint),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401 && !isPublicEndpoint(endpoint)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      const data = await response.json();
      return { data };
    } catch (error: any) {
      console.error(`API Error (PUT ${endpoint}):`, error);
      toast.error(error.message || 'An error occurred');
      return { error: error.message };
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(endpoint),
      });

      if (!response.ok) {
        if (response.status === 401 && !isPublicEndpoint(endpoint)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      const data = await response.json();
      return { data };
    } catch (error: any) {
      console.error(`API Error (DELETE ${endpoint}):`, error);
      toast.error(error.message || 'An error occurred');
      return { error: error.message };
    }
  },
}; 