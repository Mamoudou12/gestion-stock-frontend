import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
    name: null,
  }),

  actions: {
    // Méthode de connexion
    async login(email, password) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          { email, password }
        );

        const { accessToken, user } = response.data;

        if (!user.status) {
          throw new Error(
            "Votre compte est inactif. Veuillez contacter l'administrateur."
          );
        }

        this.isAuthenticated = true;
        this.token = accessToken;
        this.user = user;
        this.role = user.role;
        this.name = user.name;

        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("authToken", accessToken);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Échec de la connexion. Veuillez réessayer.";
        console.error("Erreur de connexion:", errorMessage);
        throw new Error(errorMessage);
      }
    },

    // Méthode de déconnexion
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      this.role = null;
      this.name = null;

      // Supprimer les informations de localStorage
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      localStorage.removeItem("authToken");

      // Supprimer le token des en-têtes de requêtes Axios
      delete axios.defaults.headers.common["Authorization"];

      return Promise.resolve();
    },

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
      } else {
        this.isAuthenticated = false;
        console.log("Utilisateur non authentifié.");
      }
    },
  },
});
