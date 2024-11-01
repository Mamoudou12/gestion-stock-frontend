<template>
  <div>
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Nom" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <select v-model="role" required>
        <option value="EMPLOYE">Employé</option>
        <option value="ADMIN">Administrateur</option>
      </select>
      <button type="submit">S'inscrire</button>
    </form>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import { register } from '../services/auth';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('EMPLOYE');
const error = ref(null);
const router = useRouter();

const handleRegister = async () => {
  error.value = null;

  // Log the selected role for debugging
  console.log('Rôle sélectionné :', role.value);

  try {
    await register(name.value, email.value, password.value, role.value.toUpperCase()); // Normaliser le rôle
    router.push('/login'); // Redirige vers la page de connexion
  } catch (err) {
    error.value = err.message || 'Erreur lors de l\'inscription.';
  }
};
</script>
