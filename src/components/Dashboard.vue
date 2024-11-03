<template>
  <div :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <header class="header">
      <div class="header-left">
        <button @click="toggleSidebar" class="btn btn-primary">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div class="header-right">
        <button class="btn btn-primary" @click="toggleTheme">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          <span class="ms-2">{{
            isDarkMode
              ? $t("app.header.theme.lightMode")
              : $t("app.header.theme.darkMode")
          }}</span>
        </button>
        <div class="notification">
          <i class="fas fa-bell"></i>
          <span class="badge">{{ notifications }}</span>
        </div>
        <select
          v-model="currentLanguage"
          @change="handleLanguageChange"
          class="form-select custom-select"
        >
          <option value="fr">fr</option>
          <option value="en">en</option>
          <option value="ar">ar</option>
        </select>
      </div>
    </header>

    <nav class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-cube fa-2x"></i>
        <h4 v-if="!isSidebarCollapsed">{{ $t("app.header.title") }}</h4>
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
        <li>
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
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "../stores/AuthStore";
import { useI18n } from "vue-i18n";

const isSidebarCollapsed = ref(false);
const isDarkMode = ref(false);
const notifications = ref(0);
const currentLanguage = ref("fr");
const authStore = useAuthStore();
const { locale } = useI18n();

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
</script>

<style scoped>
.sidebar-collapsed .sidebar {
  width: 80px;
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
  background-color: #FBFBFB;
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
  background-color: #FAFAFA;
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
  background-color: #E8EACC;
  border-radius: 5px;
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

/* .dark-mode .content {
  background-color: #0C0F0A;
  color: #ffffff;
} */

.dark-mode h4 {
  background-color: #0C0F0A;
  color: #ffffff;
}

.dark-mode .nav-link:hover {
  background-color: #000000;
}
</style>
