// src/stores/receptionStore.js

import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./AuthStore"; // Importer le store d'authentification si nécessaire

export const useReceptionStore = defineStore("reception", {
  state: () => ({
    receptions: [], // Stocke la liste des réceptions
    suppliers: [], // Stocke la liste des fournisseurs
  }),

  actions: {
    async fetchReceptions() {
      const authStore = useAuthStore();
      try {
        const response = await axios.get(
          "http://localhost:3000/api/receptions",
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        this.receptions = response.data.receptions || [];
      } catch (error) {
        console.error("Error fetching receptions:", error);
        throw error;
      }
    },

    async fetchSuppliers() {
      console.log("fetchSuppliers a été appelé");
      const authStore = useAuthStore();
      try {
        const response = await axios.get(
          "http://localhost:3000/api/suppliers",
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
    
        console.log("Réponse de l'API fournisseurs :", response.data); // Vérifiez la structure de la réponse
    
        // Assurez-vous que la structure correspond à celle de votre réponse de l'API
        this.suppliers = response.data.data || []; // Mettez à jour cette ligne selon la structure réelle
        console.log("Fournisseurs récupérés :", this.suppliers); // Vérifiez ce qui est récupéré
      } catch (error) {
        console.error("Erreur lors de la récupération des fournisseurs :", error);
        throw error;
      }
    },
    

    async createReception(newReception) {
      const authStore = useAuthStore();
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
        this.receptions.push(response.data.reception);
      } catch (error) {
        console.error("Error creating reception:", error);
        throw error;
      }
    },

    async updateReception(id, updatedReception) {
      const authStore = useAuthStore();
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
        const index = this.receptions.findIndex(
          (reception) => reception.id === id
        );
        if (index !== -1) {
          this.receptions[index] = response.data.reception;
        }
      } catch (error) {
        console.error("Error updating reception:", error);
        throw error;
      }
    },

    async deleteReception(id) {
      const authStore = useAuthStore();
      try {
        await axios.delete(`http://localhost:3000/api/receptions/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.receptions = this.receptions.filter(
          (reception) => reception.id !== id
        );
      } catch (error) {
        console.error("Error deleting reception:", error);
        throw error;
      }
    },
  },
});
