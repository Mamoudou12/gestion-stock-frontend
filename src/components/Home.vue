<template>
  <div class="app">
    <header class="app-header text-center p-4">
      <h1 class="display-5">Bienvenue dans le Gestionnaire de Stock</h1>
      <p class="lead">Suivez et gérez vos stocks en toute simplicité</p>
    </header>

    <div class="dashboard-cards">
      <!-- Carte pour le nombre de produits -->
      <div class="card summary-card">
        <i class="fas fa-boxes icon"></i>
        <h3 class="card-title">Produits en Stock</h3>
        <p class="card-value">{{ totalProduits }}</p>
      </div>

      <!-- Carte pour le nombre de ventes -->
      <div class="card summary-card">
        <i class="fas fa-shopping-cart icon"></i>
        <h3 class="card-title">Total des Ventes</h3>
        <p class="card-value">{{ totalVentes }}</p>
      </div>

      <!-- Carte pour les mouvements de stock -->
      <div class="card summary-card">
        <i class="fas fa-exchange-alt icon"></i>
        <h3 class="card-title">Mouvements</h3>
        <p class="card-value">{{ totalMouvements }}</p>
      </div>
    </div>

    <!-- Section pour le graphique -->
    <div class="chart-container">
      <canvas id="stockChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useProductStore } from "../stores/productStore";
import { useSaleStore } from "../stores/saleStore";
import { useMovementStore } from "../stores/movementStore"; // Importer le store des mouvements
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Store de produits, ventes et mouvements
const productStore = useProductStore();
const saleStore = useSaleStore();
const movementStore = useMovementStore();

// Références pour le graphique
const chartRef = ref(null);
let chartInstance = null;

// Calculer le nombre total de produits
const totalProduits = computed(() => productStore.products.length);

// Calculer le nombre total de ventes
const totalVentes = computed(() => saleStore.sales.length);

// Calculer le nombre total de mouvements de stock
const totalMouvements = computed(() => movementStore.movements.length);

// Données pour les produits et les mouvements de stock sur chaque mois
const productMonthlyData = ref(Array(12).fill(0)); // Initialiser avec des zéros
const movementMonthlyData = ref(Array(12).fill(0)); // Initialiser avec des zéros

// Charger les produits, ventes et mouvements au montage du composant
onMounted(async () => {
  try {
    await productStore.fetchProducts();
    await saleStore.fetchSales();
    await movementStore.fetchMovements(); // Récupérer les mouvements depuis l'API
    initializeChart();
    updateMonthlyData();
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
});

// Fonction pour initialiser le graphique
function initializeChart() {
  const ctx = document.getElementById("stockChart").getContext("2d");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Produits en Stock",
          data: productMonthlyData.value, // Initialisation avec les données des produits
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          fill: true,
        },
        {
          label: "Mouvements de Stock",
          data: movementMonthlyData.value, // Initialisation avec les données des mouvements
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

// Mettre à jour les données mensuelles pour les produits et les mouvements
function updateMonthlyData() {
  // Exemple simple : Calculer le nombre total de produits et mouvements pour chaque mois
  const currentMonth = new Date().getMonth(); // Mois actuel (0 = janvier, 11 = décembre)

  // Ajout des nouvelles données de produits et mouvements pour ce mois
  productMonthlyData.value[currentMonth] = totalProduits.value;
  movementMonthlyData.value[currentMonth] = totalMouvements.value;

  // Mettre à jour le graphique avec les nouvelles données
  if (chartInstance) {
    chartInstance.update();
  }
}

// Vous pouvez utiliser cette fonction pour mettre à jour périodiquement les données ou sur un événement spécifique
setInterval(() => {
  updateMonthlyData(); // Mettre à jour les données chaque intervalle
}, 30000); // 30 secondes, à ajuster selon vos besoins
</script>

<style scoped>
@import "@fortawesome/fontawesome-free/css/all.min.css";

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

.dashboard-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.summary-card {
  background-color: #ffffff;
  padding: 20px;
  width: 250px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.icon {
  font-size: 2rem;
  color: #007bff;
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-title {
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 10px;
}

.card-value {
  font-size: 32px;
  color: #007bff;
  font-weight: bold;
}

.chart-container {
  width: 80%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
