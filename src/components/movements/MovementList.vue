<template>
  <div class="text-primary mb-4 movement-list">
    <div class="text-center">
      <h2 class="title">Stock Movements</h2>
    </div>

    <!-- Loader ici -->
    <Loader v-if="isLoading" />

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('search_product')"
      class="form-control mb-4 search-input"
    />

    <p v-if="filteredMovements.length === 0" class="text-center text-muted">
      Aucun mouvement de stock trouvé.
    </p>

    <table v-else class="table table-hover table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Produit</th>
          <th>Utilisateur</th>
          <th>Type de Mouvement</th>
          <th>Quantité</th>
          <th>Entité</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movement in paginatedMovements" :key="movement.id">
          <td>{{ movement.id }}</td>
          <td>{{ getProductName(movement.productId) }}</td>
          <td>{{ getUserName(movement.userId) }}</td>
          <td
            :class="{
              'text-success': movement.type === 'in',
              'text-danger': movement.type === 'out',
            }"
          >
            {{ movement.type }}
          </td>
          <td>{{ movement.quantity }}</td>
          <td>{{ movement.entity }}</td>
          <td>{{ new Date(movement.movementDate).toLocaleDateString() }}</td>
          <td class="text-center">
            <button
              @click="openMovementModal(movement)"
              class="btn btn-outline-primary"
              title="Voir"
            >
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <nav v-if="totalPages > 1" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: currentPage === 1 }]" @click="prevPage">
          <button class="page-link">Précédent</button>
        </li>
        <li
          v-for="page in visiblePages"
          :key="page"
          :class="['page-item', { active: currentPage === page }]"
          @click="goToPage(page)"
        >
          <button class="page-link">{{ page }}</button>
        </li>
        <li
          :class="['page-item', { disabled: currentPage === totalPages }]"
          @click="nextPage"
        >
          <button class="page-link">Suivant</button>
        </li>
      </ul>
    </nav>

    <GenericModal
      v-if="selectedMovement"
      :movement="selectedMovement"
      modalTitle="Détails du Mouvement"
      @close="closeMovementModal"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useMovementStore } from "../../stores/movementStore";
import { useProductStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";
import GenericModal from "./MovementModal.vue";
import Loader from "../Loader.vue";
const movementStore = useMovementStore();
const productStore = useProductStore();
const userStore = useUserStore();
const movements = movementStore.movements;
const searchQuery = ref("");
const selectedMovement = ref(null);

const currentPage = ref(1);
const pageSize = ref(8);

// État du loader
const isLoading = ref(true);

// Filtrer les mouvements de stock par nom de produit
const filteredMovements = computed(() => {
  return movements.filter((movement) => {
    const productName = getProductName(movement.productId).toLowerCase();
    return productName.includes(searchQuery.value.toLowerCase());
  });
});

// Calculer le nombre total de pages
const totalPages = computed(() =>
  Math.ceil(filteredMovements.value.length / pageSize.value)
);

// Calculer les mouvements de la page actuelle
const paginatedMovements = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredMovements.value.slice(start, end);
});

// Calculer les pages visibles (maximum de 4 pages)
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 3;
  const startPage = Math.max(1, currentPage.value - 1);
  const endPage = Math.min(totalPages.value, startPage + maxVisible - 1);
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

onMounted(async () => {
  try {
    isLoading.value = true;
    // Simuler un chargement avec un délai de 2 secondes pour tester le loader
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Récupérer les données
    await movementStore.fetchMovements();
    await productStore.fetchProducts();
    await userStore.fetchUsers();
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
  } finally {
    isLoading.value = false;
  }
});

const openMovementModal = (movement) => {
  selectedMovement.value = movement;
};

const closeMovementModal = () => {
  selectedMovement.value = null;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const getProductName = (productId) => {
  const product = productStore.products.find((p) => p.id === productId);
  return product ? product.name : "Produit inconnu";
};

const getUserName = (userId) => {
  const user = userStore.users.find((u) => u.id === userId);
  return user ? user.name : "Utilisateur inconnu";
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.page-item .page-link {
  color: #007bff;
}

.page-item.disabled .page-link {
  color: #6c757d;
  cursor: not-allowed;
}

.title {
  font-family: "Georgia", serif;
  font-size: 2.8rem;
  font-weight: bold;
  color: #0056b3; /* Couleur de base du titre */
  background: linear-gradient(to right, #0056b3, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  display: inline-block;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}
.title:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
</style>
