<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("modal.title") }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <li class="list-group-item">
              <strong>{{ $t("modal.fields.id") }}:</strong> {{ product.id }}
            </li>
            <li class="list-group-item">
              <strong>{{ $t("modal.fields.name") }}:</strong> {{ product.name }}
            </li>
            <li class="list-group-item">
              <strong>{{ $t("modal.fields.stock") }}:</strong>
              {{ product.stock }}
            </li>
            <li class="list-group-item">
              <strong>{{ $t("modal.fields.purchase_price") }}:</strong>
              {{ parseFloat(product.purshase_price).toFixed(2) }}
              {{ $t("modal.currency", { currency: "MRU" }) }}
            </li>
            <li class="list-group-item">
              <strong>{{ $t("modal.fields.sale_price") }}:</strong>
              {{ parseFloat(product.sale_price).toFixed(2) }}
              {{ $t("modal.currency", { currency: "MRU" }) }}
            </li>
            <li class="list-group-item text-danger">
              <strong>{{ $t("modal.fields.safety_stock") }}:</strong>
              {{ product.safetyStock }}
            </li>
            <li class="list-group-item">
              <strong>{{ $t("modal.fields.barcode") }}:</strong>
              {{ product.barcode }}
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            {{ $t("modal.close") }}
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
