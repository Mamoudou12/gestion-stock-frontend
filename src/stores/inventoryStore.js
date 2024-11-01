import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './AuthStore';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventories: [],
  }),

  actions: {
    async fetchInventories() {
      const authStore = useAuthStore();
      console.log("Fetching inventories with token:", authStore.token); // Vérification du token
      try {
        const response = await axios.get('http://localhost:3000/api/inventories', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        console.log("Fetched inventories:", response.data.inventories); // Vérification de la réponse
        this.inventories = response.data.inventories;
      } catch (error) {
        console.error('Error fetching inventories:', error);
        throw error;
      }
    },

    async createInventory(newInventory) {
      const authStore = useAuthStore();
      console.log("Creating inventory with data:", newInventory); // Vérification des données envoyées
      try {
        const response = await axios.post('http://localhost:3000/api/inventories', newInventory, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        console.log("Created inventory:", response.data.inventory); // Vérification de la réponse
        this.inventories.push(response.data.inventory);
      } catch (error) {
        console.error('Error creating inventory:', error);
        throw error;
      }
    },

    async updateInventory(id, updatedInventory) {
      const authStore = useAuthStore();
      console.log("Updating inventory with ID:", id, "and data:", updatedInventory); // Vérification des données
      try {
        const response = await axios.put(`http://localhost:3000/api/inventories/${id}`, updatedInventory, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        const index = this.inventories.findIndex(inventory => inventory.id === id);
        if (index !== -1) {
          this.inventories[index] = response.data.inventory;
        }
      } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
      }
    },

    async deleteInventory(id) {
      const authStore = useAuthStore();
      console.log("Deleting inventory with ID:", id); // Vérification de l'ID
      try {
        await axios.delete(`http://localhost:3000/api/inventories/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.inventories = this.inventories.filter(inventory => inventory.id !== id);
      } catch (error) {
        console.error('Error deleting inventory:', error);
        throw error;
      }
    },
  },
});
