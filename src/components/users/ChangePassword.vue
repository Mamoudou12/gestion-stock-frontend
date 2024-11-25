<template>
  <div class="change-password-container">
    <!-- Bouton retour -->
    <button class="back-button" @click="goBack">
      <i class="fa fa-arrow-left"></i> Retour
    </button>

    <h2>Changer le mot de passe</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="oldPassword">Ancien mot de passe</label>
        <div class="password-input-container">
          <input
            :type="oldPasswordVisible ? 'text' : 'password'"
            id="oldPassword"
            v-model="oldPassword"
            required
            placeholder="Entrez votre ancien mot de passe"
          />
          <span class="password-toggle" @click="togglePasswordVisibility('oldPassword')">
            <i :class="oldPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="newPassword">Nouveau mot de passe</label>
        <div class="password-input-container">
          <input
            :type="newPasswordVisible ? 'text' : 'password'"
            id="newPassword"
            v-model="newPassword"
            required
            placeholder="Entrez votre nouveau mot de passe"
          />
          <span class="password-toggle" @click="togglePasswordVisibility('newPassword')">
            <i :class="newPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
        <div class="password-input-container">
          <input
            :type="confirmPasswordVisible ? 'text' : 'password'"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Confirmez votre nouveau mot de passe"
          />
          <span
            class="password-toggle"
            @click="togglePasswordVisibility('confirmPassword')"
          >
            <i :class="confirmPasswordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>
      </div>

      <button type="submit" :disabled="isSubmitting">Changer le mot de passe</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importer useRouter pour la redirection
import { useUserStore } from "../../stores/userStore";
import { useToast } from "vue-toastification"; // Importer vue-toastification pour les alertes

const userStore = useUserStore();
const router = useRouter(); // Initialiser le routeur
const toast = useToast(); // Initialiser le toast

// Références pour les champs du formulaire
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Variables pour gérer l'état de la soumission du formulaire
const isSubmitting = ref(false);

// Variables pour gérer la visibilité des mots de passe
const oldPasswordVisible = ref(false);
const newPasswordVisible = ref(false);
const confirmPasswordVisible = ref(false);

// Fonction pour alterner la visibilité des mots de passe
const togglePasswordVisibility = (field) => {
  if (field === "oldPassword") {
    oldPasswordVisible.value = !oldPasswordVisible.value;
  } else if (field === "newPassword") {
    newPasswordVisible.value = !newPasswordVisible.value;
  } else if (field === "confirmPassword") {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  }
};

// Fonction pour valider et soumettre le formulaire
const handleSubmit = async () => {
  // Vérification que le nouveau mot de passe et la confirmation sont identiques
  if (newPassword.value !== confirmPassword.value) {
    toast.error("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
    isSubmitting.value = true;
    // Appel de l'action pour changer le mot de passe
    await userStore.changePassword(oldPassword.value, newPassword.value);
    toast.success("Votre mot de passe a été changé avec succès!");
    // Réinitialiser les champs après succès
    oldPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    router.push("/dashboard/home");
  } catch (err) {
    toast.error("Erreur lors du changement du mot de passe. Veuillez réessayer.");
  } finally {
    isSubmitting.value = false;
  }
};

// Fonction pour revenir en arrière
const goBack = () => {
  router.go(-1); // Revenir à la page précédente
};
</script>

<style scoped>
.change-password-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

h2 {
  text-align: center;
  color: #4e4e4e;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #555;
  background-color: #fafafa;
  transition: border-color 0.3s ease-in-out;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
  background-color: #fff;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 12px;
  cursor: pointer;
  color: #007bff;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.back-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
}

.back-button i {
  margin-right: 8px;
}
</style>
