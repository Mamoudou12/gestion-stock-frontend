<template>
  <div class="movement-list">
    <h2 class="text-center mb-4">Liste des Mouvements de Stock</h2>

    <!-- Affichage d'un message si la liste est vide -->
    <p v-if="movements.length === 0" class="text-center text-muted">Aucun mouvement de stock trouvé.</p>

    <!-- Tableau des mouvements de stock -->
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="movement in movements" :key="movement.id">
          <td>{{ movement.id }}</td>
          <td>{{ movement.productId }}</td>
          <td>{{ movement.userId }}</td>
          <td :class="{'text-success': movement.type === 'in', 'text-danger': movement.type === 'out'}">
            {{ movement.type }}
          </td>
          <td>{{ movement.quantity }}</td>
          <td>{{ movement.entity }}</td>
          <td>{{ new Date(movement.movementDate).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMovementStore } from "../../stores/movementStore";

const movementStore = useMovementStore();
const movements = movementStore.movements;

// Charger les mouvements de stock au montage du composant
onMounted(async () => {
  await movementStore.fetchMovements();
});

</script>

<style scoped>
.movement-list {
  padding: 20px;
  background-color: #f8f9fa; /* Couleur de fond légère */
  border-radius: 5px; /* Coins arrondis */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

.table {
  margin-top: 20px;
}

/* Ajout de styles personnalisés pour les cellules */
.table td {
  vertical-align: middle; /* Centrer verticalement le contenu des cellules */
}

.table .text-success {
  font-weight: bold; /* Mettre en gras les mouvements d'entrée */
}

.table .text-danger {
  font-weight: bold; /* Mettre en gras les mouvements de sortie */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2; /* Couleur de fond pour les lignes impaires */
}
</style>
