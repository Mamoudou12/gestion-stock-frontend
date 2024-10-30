// src/stores/receptionStore.js

import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./AuthStore"; // Importer le store d'authentification si nécessaire

export const useReceptionStore = defineStore("reception", {
  state: () => ({
    receptions: [], // Stocke la liste des réceptions
  }),

  actions: {
    async fetchReceptions() {
      const authStore = useAuthStore();
      console.log("Fetching receptions...");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/receptions",
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        console.log("API response:", response.data); // Inspecte ici la réponse
        this.receptions = response.data.receptions || []; // Assure-toi d'avoir un fallback au cas où data est undefined
      } catch (error) {
        console.error("Error fetching receptions:", error);
        throw error;
      }
    },

    async createReception(newReception) {
      const authStore = useAuthStore();
      console.log("Creating reception:", newReception);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/receptions",
          newReception,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        console.log("Reception created:", response.data);
        this.receptions.push(response.data.reception); // Ajouter la réception à la liste
      } catch (error) {
        console.error("Error creating reception:", error);
        throw error;
      }
    },

    async updateReception(id, updatedReception) {
      const authStore = useAuthStore();
      console.log(`Updating reception with ID ${id}:`, updatedReception);
      try {
        const response = await axios.put(
          `http://localhost:3000/api/receptions/${id}`,
          updatedReception,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        console.log("Reception updated:", response.data);
        const index = this.receptions.findIndex(
          (reception) => reception.id === id
        );
        if (index !== -1) {
          console.log(
            `Reception with ID ${id} found at index ${index}. Updating...`
          );
          this.receptions[index] = response.data.reception; // Mettre à jour la réception dans la liste
        } else {
          console.warn(`Reception with ID ${id} not found.`);
        }
      } catch (error) {
        console.error("Error updating reception:", error);
        throw error;
      }
    },

    async deleteReception(id) {
      const authStore = useAuthStore();
      console.log(`Deleting reception with ID ${id}...`);
      try {
        await axios.delete(`http://localhost:3000/api/receptions/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        console.log(`Reception with ID ${id} deleted successfully.`);
        this.receptions = this.receptions.filter(
          (reception) => reception.id !== id
        ); // Supprimer la réception de la liste
      } catch (error) {
        console.error("Error deleting reception:", error);
        throw error;
      }
    },
  },
});
