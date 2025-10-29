// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // your Spring Boot backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Automatically attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;
