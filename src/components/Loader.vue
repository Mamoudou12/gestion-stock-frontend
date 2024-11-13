<template>
  <div class="loader">
    <div class="spinner-container">
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
      <div class="spinner"></div>
    </div>
    <div class="loading-text">Chargement...</div>
  </div>
</template>

<script setup></script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 250px;
  background: linear-gradient(135deg, #00aaff, #0077b6);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: fixed; /* Utilisation de position fixed pour le centrer à l'écran */
  top: 50%; /* Positionne le loader au milieu de l'écran */
  left: 50%; /* Positionne le loader horizontalement au centre */
  transform: translate(
    -50%,
    -50%
  ); /* Ajuste la position pour que le centre du loader soit vraiment au centre de l'écran */
  animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.spinner-container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 20px;
}

.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #fff;
  animation: bounce 1.4s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.spinner:nth-child(1) {
  animation-delay: -0.3s;
}

.spinner:nth-child(2) {
  animation-delay: -0.2s;
}

.spinner:nth-child(3) {
  animation-delay: -0.1s;
}

.spinner:nth-child(4) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

.loading-text {
  font-size: 20px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: fadeIn 2s ease-in-out;
  margin-top: 20px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
