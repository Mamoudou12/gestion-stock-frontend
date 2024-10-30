<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Product</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Name:</label>
            <input v-model="product.name" required class="form-control" />
          </div>
          <div class="mb-3">
            <label>Stock:</label>
            <input
              type="number"
              v-model="product.stock"
              required
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>Purchase Price:</label>
            <input
              type="number"
              v-model="product.purchase_price"
              required
              class="form-control"
              step="0.01"
            />
          </div>
          <div class="mb-3">
            <label>Sale Price:</label>
            <input
              type="number"
              v-model="product.sale_price"
              required
              class="form-control"
              step="0.01"
            />
          </div>
          <div class="mb-3">
            <label>Safety Stock:</label>
            <input
              type="number"
              v-model="product.safetyStock"
              required
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>Barcode:</label>
            <input
              type="text"
              v-model="product.barcode"
              required
              class="form-control"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submitProduct">
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import Swal from "sweetalert2";
import { useProductStore } from "../../stores/productStore";

const props = defineProps({
  editMode: Boolean,
  product: Object,
});

const { product: currentProduct } = toRefs(props);
const productStore = useProductStore();

const submitProduct = async () => {
  const { name, stock, purchase_price, sale_price, safetyStock, barcode } =
    currentProduct.value;

  if (
    !name ||
    stock <= 0 ||
    purchase_price <= 0 ||
    sale_price <= 0 ||
    safetyStock <= 0 ||
    !barcode
  ) {
    return Swal.fire(
      "Error",
      "All fields are required and must be valid",
      "error"
    );
  }

  try {
    if (props.editMode) {
      await productStore.updateProduct(
        currentProduct.value.id,
        currentProduct.value
      );
      Swal.fire("Success", "Product updated successfully", "success");
    } else {
      await productStore.createProduct(currentProduct.value);
      Swal.fire("Success", "Product added successfully", "success");
    }
    close();
    emit("refresh");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "An error occurred", "error");
  }
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
/* Add any specific styles for the modal here */
</style>
