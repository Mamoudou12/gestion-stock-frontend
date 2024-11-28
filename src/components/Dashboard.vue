<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <header class="header">
      <div class="header-left">
        <button @click="toggleSidebar" class="btn menu" aria-label="Menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div class="header-right">
        <!-- Affiche le nom de l'utilisateur connecté -->
        <div
          class="profile-container"
          @click="toggleProfileMenu"
          aria-haspopup="true"
          aria-expanded="isProfileMenuOpen.toString()"
        >
          <i class="fas fa-user-circle profile-icon" aria-hidden="true"></i>
          <span class="profile-name">{{ userName }}</span>

          <!-- Menu déroulant du profil -->
          <div
            v-if="isProfileMenuOpen"
            class="profile-dropdown"
            aria-labelledby="profileDropdown"
          >
            <ul>
              <li @click="goToProfile">
                <i class="fas fa-user" aria-hidden="true"></i> Profil
              </li>
              <li>
                <i class="fas fa-key" aria-hidden="true"></i>
                <a href="/dashboard/change-password">Changer le mot de passe</a>
              </li>
              <li>
                <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                <a @click="handleLogout">Déconnexion</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bouton pour activer/désactiver le mode sombre -->
        <button class="btn mode" @click="toggleTheme" aria-label="Changer le mode">
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'" aria-hidden="true"></i>
          <span class="ms-2">
            {{ isDarkMode ? "Mode sombre" : "Mode claire" }}
          </span>
        </button>

        <!-- Sélecteur de langue -->
        <select
          v-model="currentLanguage"
          @change="handleLanguageChange"
          class="form-select custom-select"
          aria-label="Sélectionner la langue"
        >
          <option value="fr">fr</option>
          <option value="en">en</option>
          <option value="ar">ar</option>
          <!-- <option value="pl">pl</option>
          <option value="esp">esp</option> -->
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
          <router-link
            to="/dashboard/home"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/home' }"
          >
            <i class="fas fa-home me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.home") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/dashboard/products"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/products' }"
          >
            <i class="fas fa-box-open me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.products") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/dashboard/suppliers"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/suppliers' }"
          >
            <i class="fas fa-industry me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.suppliers") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/dashboard/receptions"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/receptions' }"
          >
            <i class="fas fa-clipboard-check me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.receipts") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/dashboard/sales"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/sales' }"
          >
            <i class="fas fa-shopping-cart me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.sales") }}</span>
          </router-link>
        </li>
        <li v-if="authStore.role === 'ADMIN'">
          <router-link
            to="/dashboard/users"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/users' }"
          >
            <i class="fas fa-users me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.users") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/dashboard/inventory"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/inventory' }"
          >
            <i class="fas fa-warehouse me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.inventory") }}</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/dashboard/movements"
            class="nav-link"
            :class="{ active: $route.path === '/dashboard/movements' }"
          >
            <i class="fas fa-exchange-alt me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.stockMovements") }}</span>
          </router-link>
        </li>
        <li>
          <button class="nav-link" @click="handleLogout">
            <i class="fas fa-sign-out-alt me-2"></i>
            <span v-if="!isSidebarCollapsed">{{ $t("app.header.logout") }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <div class="content" :class="{ 'content-collapsed': isSidebarCollapsed }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "../stores/AuthStore";
import { useI18n } from "vue-i18n";
import { getCurrentInstance } from "vue";
import { useToast } from "vue-toastification";

const { proxy } = getCurrentInstance();

const isSidebarCollapsed = ref(false);
const isDarkMode = ref(false);
const notifications = ref(0);
const toast = useToast();
const currentLanguage = ref("en");
const authStore = useAuthStore();
const { locale } = useI18n();
const userName = ref(localStorage.getItem("userName") || "");

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const goToProfile = () => {
  proxy.$router.push("/dashboard/edit-user");
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};

const isProfileMenuOpen = ref(false);

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
  toast.info("Vous avez été déconnecté.");
};

// const navigateToProfile = () => {
//   window.location.href = "/profile"; // Rediriger vers la page du profil
// };

// const navigateToPassword = () => {
//   window.location.href = "/change-password"; // Rediriger vers la page de changement de mot de passe
// };

const greeting = ref("");

const calculateGreeting = () => {
  const hour = new Date().getHours();
  greeting.value = hour < 12 ? "Bonjour" : "Bonsoir";
};

onMounted(() => {
  calculateGreeting();
  if (authStore.user) {
    userName.value = authStore.user.name;
    localStorage.setItem("userName", authStore.user.name); // Sauvegarder le nom de l'utilisateur dans le localStorage
  }
});

// Fonction pour ouvrir/fermer le menu du profil
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};
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
  border: 1px solid #000000;
  color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode .profile-container {
  border: 1px solid #ffffff;
}

.profile-icon {
  font-size: 1.5rem;
  color: #4a90e2;
  margin-right: 10px;
}

.profile-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

/* .header-right .profile-container:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  color: #000000;
} */

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

.dark-mode .mode:hover {
  background-color: #ffffff;
  color: #000000;
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

.dark-mode .nav-link:hover {
  background-color: #ffffff;
  border-radius: 5px;
  color: #000000;
}

.dark-mode .profile-icon {
  color: #ffffff;
}

.dark-mode .profile-name {
  color: #ffffff;
}

.dark-mode .profile-name {
  color: #ffffff;
}
.profile-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.profile-dropdown ul li {
  padding: 10px;
  text-align: left;
}

.profile-dropdown ul li a {
  color: #333;
  text-decoration: none;
  display: block;
}

.profile-dropdown ul li:hover {
  background-color: #f1f1f1;
}

.profile-container:hover .profile-dropdown {
  display: block;
}

.header-right {
  display: flex;
  align-items: center;
}

.profile-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.header-right {
  display: flex;
  align-items: center;
}

.profile-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.profile-container:hover {
  transform: scale(1.05); /* Légère animation de survol */
}

.profile-icon {
  font-size: 24px;
  color: #000000;
  margin-right: 12px;
  transition: color 0.3s ease;
}

.profile-icon:hover {
  color: #007bff; /* Changement de couleur au survol */
}

.profile-name {
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
  z-index: 100;
  width: 260px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
}

.profile-container:hover .profile-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.profile-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-dropdown li {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: background-color 0.3s ease, padding-left 0.2s ease;
  width: 100%;
  border-radius: 6px; /* Coins arrondis pour chaque élément */
}

.profile-dropdown li:hover {
  background-color: #f0f0f0;
  padding-left: 20px;
}

.profile-dropdown li i {
  margin-right: 12px;
  color: #666;
  transition: color 0.3s ease;
}

.profile-dropdown li:hover i {
  color: #007bff; /* Changer la couleur des icônes au survol */
}

.profile-dropdown li:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.profile-dropdown li:last-child {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.nav-link.active {
  background-color: #000000;
  border-radius: 5px;
  color: #ffffff;
}

.nav-link:hover {
  background-color: #dddddd;
  color: #007bff;
}
.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  text-decoration: none;
  transition: background 0.3s ease;
}

.dark-mode .nav-link.active {
  background-color: #ffffff;
  border-radius: 5px;
  color: #000000;
}

.dark-mode .nav-link:hover {
  background-color: #dddddd;
  color: #007bff;
}
</style>
