<!-- SupplierViewModal.vue -->
<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Supplier Details</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <p><strong>Email:</strong> {{ supplier.email }}</p>
          <p><strong>Phone:</strong> {{ supplier.phone }}</p>
          <p><strong>Address:</strong> {{ supplier.address }}</p>
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

const props = defineProps({
  supplier: Object,
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal-dialog {
  max-width: 500px;
}
</style>
