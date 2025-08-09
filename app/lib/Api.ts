import axios from 'axios';
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// === Public API instance (no auth) ===
export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// === Private API instance (auth token required) ===
export const privateApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// === Auth Token Management ===
let authToken: string | null = null;

// Load token from localStorage (e.g., on app start)
export const loadAuthToken = () => {
  authToken = localStorage.getItem('token');
  return authToken;
};

// Save token (e.g., after login)
export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('token', token);
};

// Remove token (e.g., on logout)
export const removeAuthToken = () => {
  authToken = null;
  localStorage.removeItem('token');
};

// === Request Interceptor for privateApi ===
privateApi.interceptors.request.use(
  async config => {
    const token = authToken || localStorage.getItem('token');
    
    if (token) {
      if (!config.headers) {
        config.headers = {} as import('axios').AxiosRequestHeaders;
      }
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Accept'] = 'application/json';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    } else {
      console.warn('No token found. Redirect to Login...');
    }

    return config;
  },
  error => Promise.reject(error)
);

// === Response Interceptor for privateApi ===
privateApi.interceptors.response.use(
  response => response.data, // simplify response access
  error => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 || status === 403) {
        console.error('Unauthorized. Redirect to Login...');
        // Optional: trigger logout or redirect
      } else if (status === 404) {
        console.error('API route not found (404)');
      }
    } else {
      console.error('API error:', error.message);
    }

    return Promise.reject(error);
  }
);
