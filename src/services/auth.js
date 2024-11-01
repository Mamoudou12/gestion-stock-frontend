// src/services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // Assurez-vous que l'URL correspond à votre backend

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('token', response.data.accessToken); // Stockage du token
    return response.data; // Retourne les données utilisateur
  } catch (error) {
    throw error.response.data; // Gère l'erreur
  }
};

export const register = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
    return response.data; // Retourne les données de l'utilisateur enregistré
  } catch (error) {
    throw error.response.data; // Gère l'erreur
  }
};

export const logout = async () => {
  localStorage.removeItem('token'); // Supprime le token
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Vérifie si l'utilisateur est authentifié
};
