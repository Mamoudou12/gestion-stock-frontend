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
            v-model="name"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

// Champs de saisie pour le nom et l'email
const name = ref("");
const email = ref("");

// Surveille les changements dans les informations utilisateur
watch(
  () => userStore.user,
  (newUser) => {
    name.value = newUser.name || "";
    email.value = newUser.email || "";
  },
  { immediate: true }
);

// Fonction pour mettre à jour l'utilisateur
async function updateUser() {
  try {
    await userStore.updateCurrentUser(name.value, email.value);
    toast.success("Informations mises à jour avec succès !");
  } catch (error) {
    console.error("Erreur détaillée lors de la mise à jour:", error);
    toast.error(
      `Erreur lors de la mise à jour des informations: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

// Fonction pour retourner à la page précédente
function goBack() {
  router.back();
}
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
