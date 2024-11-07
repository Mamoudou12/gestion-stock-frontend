<template>
  <div class="app">
    <header class="app-header text-center p-4">
      <h1 class="display-5">Bienvenue dans le Gestionnaire de Stock</h1>
      <p class="lead">Suivez et gérez vos stocks en toute simplicité</p>
    </header>
    <Dashboard />
  </div>
</template>

<script setup>
import Dashboard from "./Dashboard.vue";
</script>

<style scoped>
.app {
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.app-header {
  color: #343a40;
  background-color: #ffffff;
  border-bottom: 2px solid #dee2e6;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>
