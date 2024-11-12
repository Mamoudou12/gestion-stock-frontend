<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <header class="header">
      <div class="header-left">
        <button @click="toggleSidebar" class="btn menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <div class="header-right">
        <!-- Affiche le nom de l'utilisateur connecté -->
        <div class="profile-container">
          <i class="fas fa-user-circle profile-icon"></i>
          <span class="profile-name"
            > {{ greeting }}, {{ userName }}</span
          >
        </div>

        <button class="btn mode" @click="toggleTheme">
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
          <span class="ms-2">
            {{ isDarkMode ? "Mode sombre" : "Mode claire" }}
          </span>
        </button>
        <select
          v-model="currentLanguage"
          @change="handleLanguageChange"
          class="form-select custom-select"
        >
          <option value="fr">fr</option>
          <option value="en">en</option>
          <option value="ar">ar</option>
          <option value="pl">pl</option>
          <option value="esp">esp</option>
        </select>
      </div>
    </header>

    <nav class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-cube fa-2x"></i>
        <h4 v-if="!isSidebarCollapsed">GDS</h4>
      </div>
      <ul class="list-unstyled">
        <li>
          <router-link to="/dashboard/home" class="nav-link">
            <i class="fas fa-home me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.home") }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/products" class="nav-link">
            <i class="fas fa-box-open me-2"></i>
            <span v-if="!isSidebarCollapsed">{{
              $t("app.header.products")
            }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/suppliers" class="nav-link">
            <i class="fas fa-industry me-2"></i>
            <span v-if="!isSidebarCollapsed">{{
              $t("app.header.suppliers")
            }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/receptions" class="nav-link">
            <i class="fas fa-clipboard-check me-2"></i>
            <span v-if="!isSidebarCollapsed">{{
              $t("app.header.receipts")
            }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/sales" class="nav-link">
            <i class="fas fa-shopping-cart me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.sales") }}</span>
          </router-link>
        </li>
        <li v-if="authStore.role === 'ADMIN'">
          <router-link to="/dashboard/users" class="nav-link">
            <i class="fas fa-users me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.users") }}</span>
          </router-link>
        </li>

        <li>
          <router-link to="/dashboard/inventory" class="nav-link">
            <i class="fas fa-warehouse me-2"></i>
            <span v-if="!isSidebarCollapsed">{{
              $t("app.header.inventory")
            }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/movements" class="nav-link">
            <i class="fas fa-exchange-alt me-2"></i>
            <span v-if="!isSidebarCollapsed">{{
              $t("app.header.stockMovements")
            }}</span>
          </router-link>
        </li>
        <li>
          <button class="nav-link" @click="handleLogout">
            <i class="fas fa-sign-out-alt me-2"></i>
            <span v-if="!isSidebarCollapsed">{{
              $t("app.header.logout")
            }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="content" :class="{ 'content-collapsed': isSidebarCollapsed }">
      <router-view />
      <!-- <div class="body-content">
        <h1>Bienvenue dans l'application!</h1>
        <p>Utilisez le menu à gauche pour naviguer dans l'application.</p>
        <p>Vous pouvez changer le thème et la langue selon vos préférences.</p>
        <img src="../assets//ek2.jpg" alt="stock">
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "../stores/AuthStore";
import { useI18n } from "vue-i18n";

const isSidebarCollapsed = ref(false);
const isDarkMode = ref(false);
const notifications = ref(0);
const currentLanguage = ref("fr");
const authStore = useAuthStore();
const { locale } = useI18n();
const userName = ref(localStorage.getItem("userName") || "");

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};

const handleLanguageChange = () => {
  locale.value = currentLanguage.value;
};

watch(isDarkMode, (newVal) => {
  document.body.classList.toggle("dark-mode", newVal);
});

setInterval(() => {
  notifications.value++;
}, 10000);

const handleLogout = () => {
  authStore.logout();
  window.location.href = "/";
};

const greeting = ref("");

const calculateGreeting = () => {
  const hour = new Date().getHours();
  greeting.value = hour < 12 ? "Bonjour" : "Bonsoir";
};

// Calculer la salutation lors du chargement du composant
onMounted(() => {
  calculateGreeting();
  if (authStore.user) {
    userName.value = authStore.user.name;
    localStorage.setItem("userName", authStore.user.name); // Sauvegarder le nom de l'utilisateur dans le localStorage
  }
});
</script>

<style scoped>
.sidebar-collapsed .sidebar {
  width: 80px;
}

.body-content {
  margin-top: 0;
}

.body-content img {
  width: 80%;
  margin-left: 80px;
}

.sidebar-collapsed .content {
  margin-left: 80px;
}

.content {
  margin-top: 60px;
  margin-left: 250px;
  padding: 20px;
  background-color: #f8f9fa;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.content-collapsed {
  margin-left: 80px;
}

.header {
  width: 100%;
  height: 60px;
  background-color: #fbfbfb;
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

.profile-container {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #ffffff; /* Fond neutre */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre légère pour effet de carte */
}

.profile-icon {
  font-size: 1.5rem;
  color: #4a90e2; /* Couleur distinctive pour l'icône */
  margin-right: 10px;
}

.profile-name {
  font-size: 1.2rem; /* Taille de texte agréable */
  font-weight: 600;
  color: #333; /* Couleur de texte professionnel */
}

.header-right .profile-container:hover {
  background-color: #f0f4fa; /* Change de couleur au survol pour accentuer */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15); /* Légère ombre supplémentaire */
}

.sidebar {
  width: 250px;
  background-color: #fafafa;
  color: #000000;
  padding: 20px;
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
  overflow-y: auto;
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
  background-color: #000000;
  border-radius: 5px;
  color: #ffffff;
}

.profile {
  display: flex;
  align-items: center;
  color: white;
}

.custom-select {
  width: 70px;
}

.profile-name {
  margin-right: 10px;
  font-weight: bold;
  font-size: 1rem;
}

.btn-outline-light {
  border: 1px solid white;
  color: white;
  transition: background-color 0.3s, color 0.3s;
}

.btn-outline-light:hover {
  background-color: white;
  color: #284b63;
}

.menu {
  color: #000000;
  border: 1px solid #000000;
}

.menu:hover {
  background-color: #000000;
  color: #ffffff;
}

.mode {
  color: #000000;
  border: 1px solid #000000;
}

.mode:hover {
  background-color: #000000;
  color: #ffffff;
}

.dark-mode {
  background-color: #121212;
  color: #ffffff;
}

.dark-mode .header {
  background-color: #1f1f1f;
}

.dark-mode .sidebar {
  background-color: #000000;
  color: #ffffff;
}

.dark-mode .nav-link:hover {
  background-color: #0c0f0a;
  color: #ffffff;
}

.dark-mode .menu {
  color: #ffffff;
  border: 1px solid #ffffff;
}

.dark-mode .menu:hover {
  background-color: #ffffff;
  color: #000000;
}

.dark-mode .mode {
  color: #ffffff;
  border: 1px solid #ffffff;
}

.dark-mode .mode:hover {
  background-color: #ffffff;
  color: #000000;
}

.dark-mode .nav-link:hover {
  background-color: #e8eacc;
  color: #000000;
}
</style>
