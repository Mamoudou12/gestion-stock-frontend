  // src/stores/productStore.js

  import { defineStore } from 'pinia';
  import axios from 'axios';
  import { useAuthStore } from './AuthStore'; // Import the authentication store

  export const useProductStore = defineStore('product', {
    state: () => ({
      products: [],
    }),

    actions: {
      async fetchProducts() {
        const authStore = useAuthStore(); // Get the authentication store
        try {
          const response = await axios.get('http://localhost:3000/api/products', {
            headers: {
              Authorization: `Bearer ${authStore.token}`, // Add the authentication token
            },
          });
          this.products = response.data; // Ensure this matches the structure of your API
        } catch (error) {
          console.error('Error fetching products:', error);
          throw error; // Propagate the error for further handling
        }
      },

      async createProduct(newProduct) {
        const authStore = useAuthStore();
        try {
          const response = await axios.post('http://localhost:3000/api/products', newProduct, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          });
          this.products.push(response.data); // Add the new product to the list
        } catch (error) {
          console.error('Error creating product:', error);
          throw error;
        }
      },

      async updateProduct(id, updatedProduct) {
        const authStore = useAuthStore();
        try {
          const response = await axios.put(`http://localhost:3000/api/products/${id}`, updatedProduct, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          });
          const index = this.products.findIndex(product => product.id === id);
          if (index !== -1) {
            this.products[index] = response.data.product; // Update the product in the list
          }
        } catch (error) {
          console.error('Error updating product:', error);
          throw error;
        }
      },

      async deleteProduct(id) {
        const authStore = useAuthStore();
        try {
          await axios.delete(`http://localhost:3000/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          });
          this.products = this.products.filter(product => product.id !== id); // Remove the product from the list
        } catch (error) {
          console.error('Error deleting product:', error);
          throw error;
        }
      },
    },
  });
