// src/stores/supplierStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './AuthStore'; // Import the authentication store if needed

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
  }),

  actions: {
    async fetchSuppliers() {
      const authStore = useAuthStore(); // Get the authentication store
      try {
        const response = await axios.get('http://localhost:3000/api/suppliers', {
          headers: {
            Authorization: `Bearer ${authStore.token}`, // Add the authentication token
          },
        });
        this.suppliers = response.data.data; // Ensure this matches the structure of your API
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error; // Propagate the error for further handling
      }
    },

    async createSupplier(newSupplier) {
      const authStore = useAuthStore();
      try {
        const response = await axios.post('http://localhost:3000/api/suppliers', newSupplier, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.suppliers.push(response.data.supplier); // Add the new supplier to the list
      } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
      }
    },

    async updateSupplier(id, updatedSupplier) {
      const authStore = useAuthStore();
      try {
        const response = await axios.put(`http://localhost:3000/api/suppliers/${id}`, updatedSupplier, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        const index = this.suppliers.findIndex(supplier => supplier.id === id);
        if (index !== -1) {
          this.suppliers[index] = response.data.supplier; // Update the supplier in the list
        }
      } catch (error) {
        console.error('Error updating supplier:', error);
        throw error;
      }
    },

    async deleteSupplier(id) {
      const authStore = useAuthStore();
      try {
        await axios.delete(`http://localhost:3000/api/suppliers/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.suppliers = this.suppliers.filter(supplier => supplier.id !== id); // Remove the supplier from the list
      } catch (error) {
        console.error('Error deleting supplier:', error);
        throw error;
      }
    },
  },
});
