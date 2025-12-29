// src/api/axios.js
import axios from 'axios';

// Base API URL is injected via environment variables; default only for local dev.
const envBaseUrl = process.env.REACT_APP_API_BASE_URL;
if (!envBaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('Missing REACT_APP_API_BASE_URL. Set it in your .env before building.');
}

const api = axios.create({
  baseURL: envBaseUrl || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // REQUIRED for cookies
});

let accessToken = null;

export const setAccessToken = token => {
  accessToken = token;
};
api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
