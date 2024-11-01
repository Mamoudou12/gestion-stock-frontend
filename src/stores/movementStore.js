import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./AuthStore"; // Pour l'authentification si nécessaire

export const useMovementStore = defineStore("movement", {
  state: () => ({
    movements: [], // Liste des mouvements de stock
  }),

  actions: {
    // Récupérer tous les mouvements de stock
    async fetchMovements() {
      const authStore = useAuthStore(); // Récupérer le token d'authentification
      console.log("Fetching stock movements...");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/stock-movements",
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`, // Utiliser le token pour l'authentification
            },
          }
        );
        console.log("Stock movements fetched:", response.data.stockMovements);
        this.movements = response.data.stockMovements; // Stocker les mouvements récupérés
      } catch (error) {
        console.error("Error fetching stock movements:", error);
        throw error; // Gérer les erreurs si nécessaire
      }
    },
  },
});
