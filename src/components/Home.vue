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
@import "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";

.app {
  background: linear-gradient(to bottom, #e9f4fb, #fefefe);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: "Roboto", sans-serif;
}

.app-header {
  color: #ffffff;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 40px;
}

.app-header h1 {
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.app-header p {
  font-weight: 400;
  margin: 0;
  font-size: 18px;
}

.dashboard-cards {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.summary-card:hover {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 2rem;
  color: #4b7bec;
  position: absolute;
  top: 15px;
  right: 15px;
  opacity: 0.8;
}

.card-title {
  font-size: 20px;
  color: #34495e;
  margin-bottom: 15px;
  font-weight: 500;
}

.card-value {
  font-size: 42px;
  color: #4b7bec;
  font-weight: bold;
}

.chart-container {
  width: 90%;
  max-width: 1100px;
  margin: 40px auto;
  padding: 40px;
  background: linear-gradient(to bottom, #ffffff, #f7f9fc);
  border-radius: 16px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5eaf0;
}

.chart-container:hover {
  border-color: #4b7bec;
  transition: border-color 0.3s ease;
}

.summary-card {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  padding: 30px;
  width: 280px;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
}

.summary-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #007bff, #28a745);
  z-index: -1;
  opacity: 0.15;
  transform: scale(1.5);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.summary-card:hover::before {
  opacity: 0.25;
  transform: scale(1.1);
}

.summary-card:hover {
  transform: translateY(-10px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.15), 0px 6px 12px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 1.5rem;
  color: #007bff;
  background: rgba(0, 123, 255, 0.1);
  padding: 15px;
  border-radius: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-title {
  font-size: 15px;
  color: #6c757d;
  margin-bottom: 15px;
  font-weight: 600;
}

.card-value {
  font-size: 40px;
  color: #007bff;
  font-weight: bold;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}
</style>
