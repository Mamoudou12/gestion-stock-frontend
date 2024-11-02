<!-- MovementList.vue -->
<template>
  <div class="text-primary mb-4 movement-list">
    <h2 class="text-center mb-4">Liste des Mouvements de Stock</h2>

    <p v-if="movements.length === 0" class="text-center text-muted">
      Aucun mouvement de stock trouvé.
    </p>

    <table v-else class="table table-striped table-hover table-bordered">
      <thead class="table-light">
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
        <tr v-for="movement in movements" :key="movement.id">
          <td>{{ movement.id }}</td>
          <td>{{ getProductName(movement.productId) }}</td>
          <!-- Afficher le nom du produit -->
          <td>{{ getUserName(movement.userId) }}</td>
          <!-- Afficher le nom de l'utilisateur -->
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

    <GenericModal
      v-if="selectedMovement"
      :movement="selectedMovement"
      modalTitle="Détails du Mouvement"
      @close="closeMovementModal"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMovementStore } from "../../stores/movementStore";
import { useProductStore } from "../../stores/productStore"; // Importer le store des produits
import { useUserStore } from "../../stores/userStore"; // Importer le store des utilisateurs
import GenericModal from "./MovementModal.vue";

const movementStore = useMovementStore();
const productStore = useProductStore(); // Utiliser le store des produits
const userStore = useUserStore(); // Utiliser le store des utilisateurs
const movements = movementStore.movements;
const selectedMovement = ref(null);

onMounted(async () => {
  await movementStore.fetchMovements();
  await productStore.fetchProducts(); // Assurez-vous que les produits sont chargés
  await userStore.fetchUsers(); // Assurez-vous que les utilisateurs sont chargés
});

// Ouvrir le modal pour le mouvement sélectionné
const openMovementModal = (movement) => {
  selectedMovement.value = movement;
};

// Fermer le modal
const closeMovementModal = () => {
  selectedMovement.value = null;
};

// Fonction pour obtenir le nom du produit par son ID
const getProductName = (productId) => {
  const product = productStore.products.find((p) => p.id === productId);
  return product ? product.name : "Produit inconnu"; // Retourner 'Produit inconnu' si le produit n'est pas trouvé
};

// Fonction pour obtenir le nom de l'utilisateur par son ID
const getUserName = (userId) => {
  const user = userStore.users.find((u) => u.id === userId);
  return user ? user.name : "Utilisateur inconnu"; // Retourner 'Utilisateur inconnu' si l'utilisateur n'est pas trouvé
};
</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
</style>
