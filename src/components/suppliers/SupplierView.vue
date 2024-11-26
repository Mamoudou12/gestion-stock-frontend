<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">View Supplier</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Name:</label>
            <!-- Affichage du champ email en lecture seule -->
            <input v-model="supplier.name" class="form-control" readonly />
          </div>
          <div class="mb-3">
            <label>Email:</label>
            <!-- Affichage du champ email en lecture seule -->
            <input v-model="supplier.email" class="form-control" readonly />
          </div>
          <div class="mb-3">
            <label>Phone:</label>
            <!-- Affichage du champ téléphone en lecture seule -->
            <input v-model="supplier.phone" class="form-control" readonly />
          </div>
          <div class="mb-3">
            <label>Address:</label>
            <!-- Affichage du champ adresse en lecture seule -->
            <input v-model="supplier.address" class="form-control" readonly />
          </div>
        </div>
        <div class="modal-footer">
          <!-- Bouton de fermeture uniquement -->
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  supplier: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
