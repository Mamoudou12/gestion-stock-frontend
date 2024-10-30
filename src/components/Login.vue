<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Import de sweetalert2

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  error.value = null;
  loading.value = true;

  try {
    await authStore.login(email.value, password.value);
    if (authStore.isAuthenticated) {
      // Afficher un message de succès
      Swal.fire({
        title: "Connexion réussie!",
        text: "Bienvenue, vous êtes maintenant connecté.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Redirection vers le tableau de bord
      await router.replace("/dashboard");
    } else {
      error.value = "Invalid credentials. Please try again.";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Layout principal */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #2b2e4a, #4f5d75);
  padding: 20px;
}

/* Carte de connexion */
.login-card {
  background-color: #f9f9f9;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

/* Champs de formulaire */
.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s;
}

/* Effet au focus */
.input-group input:focus {
  border-color: #4a90e2;
  outline: none;
}

/* Bouton de connexion */
.login-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:disabled {
  background-color: #a6c8ff;
  cursor: not-allowed;
}

.login-button:hover:enabled {
  background-color: #357ab8;
}

/* Message d'erreur */
.error {
  color: #e74c3c;
  margin-top: 15px;
  animation: shake 0.3s;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>
