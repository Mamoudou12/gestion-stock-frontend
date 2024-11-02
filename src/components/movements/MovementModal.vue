<!-- GenericModal.vue -->
<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <!-- Affichage des informations du fournisseur -->
          <div v-if="isSupplier">
            <div class="row mb-3">
              <div class="col">
                <label>Email:</label>
                <input v-model="supplier.email" class="form-control" readonly />
              </div>
              <div class="col">
                <label>Phone:</label>
                <input v-model="supplier.phone" class="form-control" readonly />
              </div>
            </div>
            <div class="mb-3">
              <label>Address:</label>
              <input v-model="supplier.address" class="form-control" readonly />
            </div>
          </div>

          <!-- Affichage des informations du mouvement -->
          <div v-else-if="isMovement">
            <div class="row mb-3">
              <div class="col">
                <label>ID:</label>
                <input v-model="movement.id" class="form-control" readonly />
              </div>
              <div class="col">
                <label>Produit:</label>
                <input
                  v-model="movement.productId"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label>Utilisateur:</label>
                <input
                  v-model="movement.userId"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col">
                <label>Type:</label>
                <input v-model="movement.type" class="form-control" readonly />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label>Quantité:</label>
                <input
                  v-model="movement.quantity"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col">
                <label>Entité:</label>
                <input
                  v-model="movement.entity"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Date:</label>
              <input
                :value="formatDate(movement.movementDate)"
                class="form-control"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  supplier: {
    type: Object,
    default: null,
  },
  movement: {
    type: Object,
    default: null,
  },
  modalTitle: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

// Détermine si le modal affiche des informations de fournisseur
const isSupplier = computed(() => props.supplier !== null);
// Détermine si le modal affiche des informations de mouvement
const isMovement = computed(() => props.movement !== null);

// Formater la date pour l'affichage
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR"); // Formatage français (jour/mois/année)
};
</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
</style>
