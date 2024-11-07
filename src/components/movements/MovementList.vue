<template>
  <div class="text-primary mb-4 movement-list">
    <h2 class="text-center mb-4">Liste des Mouvements de Stock</h2>
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
          <td :class="{'text-success': movement.type === 'in', 'text-danger': movement.type === 'out'}">
            {{ movement.type }}
          </td>
          <td>{{ movement.quantity }}</td>
          <td>{{ movement.entity }}</td>
          <td>{{ new Date(movement.movementDate).toLocaleDateString() }}</td>
          <td class="text-center">
            <button @click="openMovementModal(movement)" class="btn btn-outline-primary" title="Voir">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li :class="['page-item', { disabled: currentPage === 1 }]" @click="prevPage">
          <button class="page-link">Précédent</button>
        </li>
        <li v-for="page in visiblePages" :key="page" :class="['page-item', { active: currentPage === page }]" @click="goToPage(page)">
          <button class="page-link">{{ page }}</button>
        </li>
        <li :class="['page-item', { disabled: currentPage === totalPages }]" @click="nextPage">
          <button class="page-link">Suivant</button>
        </li>
      </ul>
    </nav>

    <GenericModal v-if="selectedMovement" :movement="selectedMovement" modalTitle="Détails du Mouvement" @close="closeMovementModal" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useMovementStore } from "../../stores/movementStore";
import { useProductStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";
import GenericModal from "./MovementModal.vue";

const movementStore = useMovementStore();
const productStore = useProductStore();
const userStore = useUserStore();
const movements = movementStore.movements;
const searchQuery = ref("");
const selectedMovement = ref(null);

// Pagination variables
const currentPage = ref(1);
const pageSize = ref(8);

// Filtrer les mouvements de stock par nom de produit
const filteredMovements = computed(() => {
  return movements.filter(movement => {
    const productName = getProductName(movement.productId).toLowerCase();
    return productName.includes(searchQuery.value.toLowerCase());
  });
});

// Calculer le nombre total de pages
const totalPages = computed(() => Math.ceil(filteredMovements.value.length / pageSize.value));

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
  await movementStore.fetchMovements();
  await productStore.fetchProducts();
  await userStore.fetchUsers();
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
</style>
