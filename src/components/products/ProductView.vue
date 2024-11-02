<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Product Preview</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Name:</strong> {{ product.name }}
            </li>
            <li class="list-group-item">
              <strong>ID:</strong> {{ product.id }}
            </li>
            <li class="list-group-item">
              <strong>Stock:</strong> {{ product.stock }}
            </li>
            <li class="list-group-item">
              <strong>Purchase Price:</strong>
              {{ parseFloat(product.purshase_price).toFixed(2) }} MRU
            </li>
            <li class="list-group-item">
              <strong>Sale Price:</strong>
              {{ parseFloat(product.sale_price).toFixed(2) }} MRU
            </li>
            <li class="list-group-item text-danger">
              <strong>Safety Stock:</strong> {{ product.safetyStock }}
            </li>
            <li class="list-group-item">
              <strong>Barcode:</strong> {{ product.barcode }}
            </li>
          </ul>
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
const props = defineProps({
  product: Object,
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
