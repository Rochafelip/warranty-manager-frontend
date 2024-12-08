// src/api/axios.js

import axios from 'axios';

// Configurações globais do Axios
const api = axios.create({
  baseURL: 'http://localhost:4000',  // URL base da sua API
});

// Recupera o token do sessionStorage
const token = sessionStorage.getItem('access-token');

// Se o token estiver presente, adicione o token no cabeçalho das requisições
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
