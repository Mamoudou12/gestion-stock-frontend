// stores/saleStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './AuthStore'; // Import du store d'authentification si nécessaire

export const useSaleStore = defineStore('sale', {
  state: () => ({
    sales: [], // Initialisation de `sales` comme tableau vide
  }),

  actions: {
    async fetchSales() {
      const authStore = useAuthStore(); // Récupération du store d'authentification
      console.log('Fetching sales...');
      try {
        const response = await axios.get('http://localhost:3000/api/sales', {
          headers: {
            Authorization: `Bearer ${authStore.token}`, // Ajout du token d'authentification
          },
        });
        console.log('Sales fetched:', response.data.sales);
        this.sales = response.data.sales; // Assignation correcte avec `sales`
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching sales';
        console.error('Error fetching sales:', errorMessage);
        throw new Error(errorMessage); // Propagation de l'erreur avec le message de l'API
      }
    },

    async createSale(newSale) {
      const authStore = useAuthStore();
      console.log('Creating sale:', newSale);
      try {
        const response = await axios.post('http://localhost:3000/api/sales', newSale, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        console.log('Sale created:', response.data.sale);
        this.sales.push(response.data.sale); // Ajout de la nouvelle vente à la liste
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error creating sale';
        console.error('Error creating sale:', errorMessage);
        throw new Error(errorMessage); // Propagation de l'erreur avec le message de l'API
      }
    },

    async updateSale(id, updatedSale) {
      const authStore = useAuthStore();
      console.log('Updating sale with ID:', id, 'to:', updatedSale);
      try {
        const response = await axios.put(`http://localhost:3000/api/sales/${id}`, updatedSale, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        console.log('Sale updated:', response.data.sale);
        const index = this.sales.findIndex(sale => sale.id === id);
        if (index !== -1) {
          this.sales[index] = response.data.sale; // Mise à jour de la vente dans la liste
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error updating sale';
        console.error('Error updating sale:', errorMessage);
        throw new Error(errorMessage); // Propagation de l'erreur avec le message de l'API
      }
    },

    async deleteSale(id) {
      const authStore = useAuthStore();
      console.log('Deleting sale with ID:', id);
      try {
        await axios.delete(`http://localhost:3000/api/sales/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        console.log('Sale deleted:', id);
        this.sales = this.sales.filter(sale => sale.id !== id); // Suppression de la vente de la liste
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting sale';
        console.error('Error deleting sale:', errorMessage);
        throw new Error(errorMessage); // Propagation de l'erreur avec le message de l'API
      }
    },
  },
});
