<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="toggleSidebar" class="btn btn-primary">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div class="header-right">
        <button class="btn btn-primary" @click="toggleTheme">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          <span class="ms-2">{{ isDarkMode ? "Light Mode" : "Dark Mode" }}</span>
        </button>
        <div class="notification">
          <i class="fas fa-bell"></i>
          <span class="badge">{{ notifications }}</span>
        </div>

        <!-- Profil Utilisateur -->
        <div class="profile">
          <span class="profile-name">John Doe</span>
          <button class="btn btn-outline-light ms-2" @click="handleLogout">Déconnexion</button>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-cube fa-2x"></i>
        <h4 v-if="!isSidebarCollapsed">Mon Application</h4>
      </div>
      <ul class="list-unstyled">
        <li>
          <router-link to="/dashboard/home" class="nav-link">
            <i class="fas fa-home me-2"></i>
            <span v-if="!isSidebarCollapsed">Accueil</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/products" class="nav-link">
            <i class="fas fa-box-open me-2"></i>
            <span v-if="!isSidebarCollapsed">Produits</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/suppliers" class="nav-link">
            <i class="fas fa-industry me-2"></i>
            <span v-if="!isSidebarCollapsed">Fournisseurs</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/receptions" class="nav-link">
            <i class="fas fa-clipboard-check me-2"></i>
            <span v-if="!isSidebarCollapsed">Réceptions</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/sales" class="nav-link">
            <i class="fas fa-shopping-cart me-2"></i>
            <span v-if="!isSidebarCollapsed">Ventes</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/users" class="nav-link">
            <i class="fas fa-users me-2"></i>
            <span v-if="!isSidebarCollapsed">Utilisateurs</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/inventory" class="nav-link">
            <i class="fas fa-warehouse me-2"></i>
            <span v-if="!isSidebarCollapsed">Inventaires</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/movements" class="nav-link">
            <i class="fas fa-exchange-alt me-2"></i>
            <span v-if="!isSidebarCollapsed">Mouvement de stock</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="content" :class="{ 'content-collapsed': isSidebarCollapsed }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "../stores/AuthStore"; // Importez le store

// State Management
const isSidebarCollapsed = ref(false);
const isDarkMode = ref(false);
const notifications = ref(0);
const authStore = useAuthStore(); // Initialisez le store d'authentification

// Toggle sidebar collapse
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// Toggle light/dark mode
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};

// Watch for theme changes
watch(isDarkMode, (newVal) => {
  document.body.classList.toggle("dark-mode", newVal);
});

// Simulate notification updates
setInterval(() => {
  notifications.value++;
}, 10000); // Augmente le nombre de notifications toutes les 10 secondes

// Logout functionality
const handleLogout = () => {
  authStore.logout(); // Appeler la méthode de déconnexion du store
  // Rediriger vers la page de connexion
  window.location.href = '/'; // Redirection vers la page de connexion
};
</script>

<style scoped>
/* Sidebar Collapsed */
.sidebar-collapsed .sidebar {
  width: 80px;
}

.sidebar-collapsed .content {
  margin-left: 80px;
}

/* Main Content */
.content {
  margin-top: 60px;
  margin-left: 250px;
  padding: 20px;
  background-color: #f8f9fa; /* Light background */
  transition: margin-left 0.3s ease;
}

.content-collapsed {
  margin-left: 80px; /* Ajustez ceci pour correspondre à la largeur de la sidebar réduite */
}

/* Header, Sidebar, Dark Mode Styles */
.header {
  width: 100%;
  height: 60px;
  background-color: #284b63; /* Blue header */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification {
  position: relative;
  font-size: 1.5rem;
  color: white;
}

.notification .badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.75rem;
}

.sidebar {
  width: 250px;
  background-color: #284b63; /* Blue sidebar */
  color: white;
  padding: 20px;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background-color: #0056b3; /* Darker blue on hover */
  border-radius: 5px;
}

/* Profile Styles */
.profile {
  display: flex;
  align-items: center;
  color: white; /* Couleur du texte */
}

.profile-name {
  margin-right: 10px;
  font-weight: bold;
  font-size: 1rem; /* Taille de police pour le nom */
}

.btn-outline-light {
  border: 1px solid white;
  color: white;
  transition: background-color 0.3s, color 0.3s;
}

.btn-outline-light:hover {
  background-color: white;
  color: #284b63; /* Change la couleur du texte lors du survol */
}

/* Dark Mode Styles */
body.dark-mode {
  background-color: #1a1a1a; /* Dark background */
  color: white;
}

body.dark-mode .header {
  background-color: #153243; /* Darker blue for header */
}

body.dark-mode .sidebar {
  background-color: #153243; /* Dark sidebar */
}
</style>
