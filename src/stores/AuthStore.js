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

        // Log the complete response for debugging
        console.log('Full response:', response.data);

        // Destructure the tokens properly
        const { accessToken, refreshToken } = response.data;

        console.log('Access token received:', accessToken);
        console.log('Refresh token received:', refreshToken);

        this.isAuthenticated = true;
        this.token = accessToken;
        localStorage.setItem('authToken', accessToken);

        // Add the token to Axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        this.isAuthenticated = false;
        this.user = null;
        this.token = null;
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw new Error('Login failed.');
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"]; // Remove token from Axios headers
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
