<template>
  <div class="forgot-password">
    <h4>Réinitialiser le mot de passe</h4>
    <form @submit.prevent="handleForgotPassword">
      <input
        type="email"
        v-model="email"
        placeholder="Entrez votre email"
        required
      />
      <button type="submit">Envoyer</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const email = ref("");
const message = ref("");
const toast = useToast();

async function handleForgotPassword() {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/request-password-reset",
      { email: email.value }
    );
    message.value = response.data.message || "Lien de réinitialisation envoyé.";
    toast.success("Lien de réinitialisation envoyé !");
  } catch (error) {
    message.value = error.response.data.message || "Erreur lors de l'envoi.";
    toast.error("Erreur lors de l'envoi.");
  }
  console.log("Valeur de l'email :", email.value);
}
</script>

<style scoped>
.forgot-password {
  background-color: #f8f9fa; /* Couleur de fond douce pour le formulaire */
  color: #333; /* Couleur du texte pour plus de lisibilité */
  padding: 2.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  margin: 80px auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Ombre plus douce et plus profonde */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Ajout d'une transition */
}

.forgot-password:hover {
  transform: translateY(-5px); /* Effet de soulèvement au survol */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); /* Ombre plus profonde au survol */
}

h4 {
  color: #333; /* Couleur du titre */
  text-align: center;
  margin-bottom: 1.5rem; /* Espacement légèrement réduit */
  font-size: 1.25rem; /* Taille du titre améliorée */
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacement uniforme entre les éléments */
}

input[type="email"] {
  padding: 12px;
  border: 2px solid #0d6efd; /* Bordure bleue */
  border-radius: 6px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input[type="email"]::placeholder {
  color: #aaa;
}

input[type="email"]:focus {
  border-color: #0a58ca; /* Couleur plus foncée au focus */
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.3);
}

button {
  background-color: #0d6efd; /* Couleur bleue pour le bouton */
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #0a58ca; /* Couleur plus foncée au survol */
  transform: translateY(-2px); /* Effet de survol pour le bouton */
}

button:active {
  transform: translateY(0); /* Annulation de l'effet au clic */
}

.message {
  margin-top: 1.5rem;
  text-align: center;
  color: #333; /* Changement de couleur pour plus de contraste */
  font-size: 1rem;
  font-weight: 500;
}

.message.success {
  color: #0d6efd; /* Bleu pour les messages de succès */
}

.message.error {
  color: #dc3545; /* Rouge pour les erreurs */
}
</style>
