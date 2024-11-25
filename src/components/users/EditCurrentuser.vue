<template>
  <div class="container mt-5">
    <button
      @click="goBack"
      class="btn btn-link text-decoration-none back-arrow"
    >
      <i class="fas fa-arrow-left"></i> Retour
    </button>

    <h2 class="text-center mb-4">Mettre à jour les informations utilisateur</h2>
    <div class="card shadow-lg p-4">
      <form @submit.prevent="updateUser">
        <div class="mb-3">
          <label for="name" class="form-label">Nom:</label>
          <input
            id="name"
            v-model="user.name"
            type="text"
            class="form-control"
            placeholder="Entrez le nom"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
            id="email"
            v-model="user.email"
            type="email"
            class="form-control"
            placeholder="Entrez l'email"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">
          Mettre à jour
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toastification";

const userStore = useUserStore(); // Store Pinia
const router = useRouter();
const toast = useToast();

// Charger les données utilisateur
const user = computed(() => userStore.user);

// Fonction pour mettre à jour les informations utilisateur
async function updateUser() {
  try {
    await userStore.updateCurrentUser(user.value.name, user.value.email);
    toast.success("Informations mises à jour avec succès !");
    router.push("/dashboard/home");
  } catch (error) {
    toast.error(
      `Erreur lors de la mise à jour des informations : ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

// Retour à la page précédente
function goBack() {
  router.back();
}

// Charger les informations utilisateur au montage
onMounted(async () => {
  try {
    await userStore.fetchCurrentUser();
  } catch (error) {
    toast.error("Impossible de charger les informations de l'utilisateur.");
  }
});
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: 0 auto;
}
.form-label {
  font-weight: bold;
}
.back-arrow {
  font-size: 1.2em;
  color: #0d6efd;
  margin-bottom: 1rem;
}
</style>
