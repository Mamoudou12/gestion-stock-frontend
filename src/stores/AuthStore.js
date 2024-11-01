import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

        const { accessToken, user } = response.data;

        this.isAuthenticated = true;
        this.token = accessToken;
        this.user = user; // Set user information
        localStorage.setItem('authToken', accessToken);

        // Add the token to Axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
        console.error('Login error:', errorMessage);
        throw new Error(errorMessage); // Lancez l'erreur avec le message de l'API
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"]; // Remove token from Axios headers
      return Promise.resolve(); // Retourner une promesse résolue
    },
    
    checkAuth() {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.isAuthenticated = true;
        this.token = token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        this.isAuthenticated = false;
      }
    },
  },
});
