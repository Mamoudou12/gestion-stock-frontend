<template>
  <div class="home">
    <h1>Bienvenue dans l'application de gestion de stock</h1>
    <button @click="logout">Déconnexion</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("authToken"); // Retirer le token
  router.push({ name: "Login" }); // Rediriger vers la page de login
};
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
