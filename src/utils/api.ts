import { toast } from 'react-toastify';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

const BASE_URL = 'http://localhost:5000/api';

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401) {
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 401) {
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
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
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