<template>
  <div class="modal fade show" tabindex="-1" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Inventory Details</h5>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p><strong>Quantity:</strong> {{ inventory.quantity }}</p>
          <p><strong>Remarks:</strong> {{ inventory.remarks }}</p>
          <p>
            <strong>Product:</strong> {{ getProductName(inventory.productId) }}
          </p>
          <!-- Display product name -->
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
import { defineProps, defineEmits } from "vue";
import { useProductStore } from "../../stores/productStore"; // Import productStore

const props = defineProps({
  inventory: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

// Initialize product store
const productStore = useProductStore(); // Access productStore

// Get product name by ID
const getProductName = (productId) => {
  const product = productStore.products.find(
    (product) => product.id === productId
  );
  return product ? product.name : "Unknown Product"; // Return product name or a default message
};
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
</style>
