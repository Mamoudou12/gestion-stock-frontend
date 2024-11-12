import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
    role: null, // Ajoutez une propriété pour stocker le rôle de l'utilisateur
    name: null, // Propriété pour stocker le nom de l'utilisateur
  }),

  actions: {
    // Méthode de connexion
    async login(email, password) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          { email, password }
        );

        console.log("Réponse de l'API après login :", response.data);

        const { accessToken, user } = response.data;

        this.isAuthenticated = true;
        this.token = accessToken;
        this.user = user;
        this.role = user.role; // Stockez le rôle dans le store
        this.name = user.name; // Stockez le nom dans le store

        // Stocker le nom et le rôle dans localStorage
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.role); // Stockez également le rôle
        localStorage.setItem("authToken", accessToken);

        // Ajouter le token aux en-têtes de requêtes Axios
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        console.error("Login error:", errorMessage);
        throw new Error(errorMessage);
      }
    },

    // Méthode de déconnexion
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      this.role = null; // Réinitialiser le rôle de l'utilisateur
      this.name = null; // Réinitialiser le nom de l'utilisateur

      // Supprimer le nom, le rôle et le token de localStorage
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("authToken");

      // Supprimer le token des en-têtes de requêtes Axios
      delete axios.defaults.headers.common["Authorization"];

      console.log("Déconnexion effectuée. Rôle et nom réinitialisés.");
      return Promise.resolve();
    },

    // Vérification de l'authentification
    checkAuth() {
      const token = localStorage.getItem("authToken");
      if (token) {
        this.isAuthenticated = true;
        this.token = token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Récupérer le nom et le rôle de l'utilisateur depuis localStorage
        const userName = localStorage.getItem("userName");
        const userRole = localStorage.getItem("userRole");

        if (userName) {
          this.name = userName;
          console.log("Nom de l'utilisateur récupéré :", userName);
        }

        if (userRole) {
          this.role = userRole;
          console.log("Rôle de l'utilisateur récupéré :", userRole);
        }

        // console.log("Utilisateur authentifié avec token :", token);
      } else {
        this.isAuthenticated = false;
        console.log("Utilisateur non authentifié.");
      }
    },
  },
});
