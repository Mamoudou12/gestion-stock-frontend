// src/stores/userStore.js

import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./AuthStore"; // Import the authentication store

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    userName: "",
    user: {},
  }),

  actions: {
    async fetchUsers() {
      const authStore = useAuthStore();
      try {
        const response = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.users = response.data.users; // Assurez-vous que `status` est inclus dans la réponse de l'API
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    async createUser(newUser) {
      const authStore = useAuthStore();
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users",
          newUser,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        this.users.push(response.data.user); // Inclure `status` lors de l'ajout d'un nouvel utilisateur
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },

    async updateUser(id, updatedUser) {
      const authStore = useAuthStore();
      try {
        const response = await axios.put(
          `http://localhost:3000/api/users/${id}`,
          updatedUser,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          this.users[index] = response.data.user; // Mettre à jour l'utilisateur dans la liste, incluant `status`
        }
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async deleteUser(id) {
      const authStore = useAuthStore();
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    async getUserById(id) {
      const authStore = useAuthStore();
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        return response.data.user; // Retourne l'utilisateur avec `status`
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
      }
    },

    // Mettre à jour le statut de l'utilisateur
    async updateUserStatus(id, status) {
      const authStore = useAuthStore();
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/users/${id}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          this.users[index].status = response.data.user.status; // Mettre à jour le statut dans la liste
        }
      } catch (error) {
        console.error("Error updating user status:", error);
        throw error;
      }
    },

    async fetchCurrentUser() {
      const authStore = useAuthStore();
      try {
        const response = await axios.get("http://localhost:3000/api/user/me", {
          headers: {
            Authorization: `Bearer ${authStore.token}`, // Assurez-vous que vous avez un token dans votre store
          },
        });
        this.user = response.data.user;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations utilisateur:",
          error
        );
        throw error;
      }
    },

    async updateCurrentUser(name, email) {
      const authStore = useAuthStore();
      try {
        const response = await axios.put(
          `http://localhost:3000/api/user/update`,
          { name, email },
          {
            headers: { Authorization: `Bearer ${authStore.token}` },
          }
        );

        if (response.data && response.data.user) {
          this.user = response.data.user; // Mettre à jour immédiatement les données dans le store
        } else {
          throw new Error("Réponse du serveur invalide");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour des informations:", error);
        throw error;
      }
    },
    async changePassword(currentPassword, newPassword) {
      const authStore = useAuthStore();
      try {
        const response = await axios.put(
          "http://localhost:3000/api/change-password",
          {
            currentPassword, // Correspond à "oldPassword" ou "currentPassword" dans votre API
            newPassword, // Correspond à "newPassword" dans votre API
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        return response.data; // Retourne la réponse de l'API
      } catch (error) {
        // Gérer les erreurs et les afficher dans le composant
        console.error("Error changing password:", error);
        throw new Error(
          error.response?.data?.message || "Error changing password."
        );
      }
    },
  },
});
