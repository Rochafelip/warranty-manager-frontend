import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:4000/',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access-token');
  const client = sessionStorage.getItem('client');
  const uid = sessionStorage.getItem('uid');

  if (token && client && uid) {
    config.headers['access-token'] = token;
    config.headers['client'] = client;
    config.headers['uid'] = uid;
  }

  return config;
});

export default api;
