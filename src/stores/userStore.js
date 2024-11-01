// src/stores/userStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './AuthStore'; // Import the authentication store

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
  }),

  actions: {
    async fetchUsers() {
      const authStore = useAuthStore(); // Get the authentication store
      try {
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${authStore.token}`, // Add the authentication token
          },
        });
        this.users = response.data.users; // Ensure this matches the structure of your API
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Propagate the error for further handling
      }
    },

    async createUser(newUser) {
      const authStore = useAuthStore();
      try {
        const response = await axios.post('http://localhost:3000/api/users', newUser, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.users.push(response.data.user); // Add the new user to the list
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },

    async updateUser(id, updatedUser) {
      const authStore = useAuthStore();
      try {
        const response = await axios.put(`http://localhost:3000/api/users/${id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
          this.users[index] = response.data.user; // Update the user in the list
        }
      } catch (error) {
        console.error('Error updating user:', error);
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
        this.users = this.users.filter(user => user.id !== id); // Remove the user from the list
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },

    async getUserById(id) {
      const authStore = useAuthStore();
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        return response.data.user; // Return the user data
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }
    },
  },
});
