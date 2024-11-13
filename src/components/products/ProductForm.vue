<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Product</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Name:</label>
              <input
                v-model="product.name"
                :disabled="previewMode"
                required
                class="form-control"
              />
              <small class="text-danger">{{ errors.name }}</small>
            </div>
            <div class="col-md-6 mb-3">
              <label>Stock:</label>
              <input
                type="number"
                v-model="product.stock"
                :disabled="previewMode"
                required
                class="form-control"
              />
              <small class="text-danger">{{ errors.stock }}</small>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Purchase Price:</label>
              <input
                type="number"
                v-model="product.purshase_price"
                :disabled="previewMode"
                required
                class="form-control"
                step="0.01"
              />
              <small class="text-danger">{{ errors.purshase_price }}</small>
            </div>
            <div class="col-md-6 mb-3">
              <label>Sale Price:</label>
              <input
                type="number"
                v-model="product.sale_price"
                :disabled="previewMode"
                required
                class="form-control"
                step="0.01"
              />
              <small class="text-danger">{{ errors.sale_price }}</small>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Safety Stock:</label>
              <input
                type="number"
                v-model="product.safetyStock"
                :disabled="previewMode"
                required
                class="form-control"
              />
              <small class="text-danger">{{ errors.safetyStock }}</small>
            </div>
            <div class="col-md-6 mb-3">
              <label>Barcode:</label>
              <input
                type="text"
                v-model="product.barcode"
                :disabled="previewMode"
                required
                class="form-control"
              />
              <small class="text-danger">{{ errors.barcode }}</small>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitProduct"
            :disabled="previewMode"
          >
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useProductStore } from "../../stores/productStore";

const toast = useToast();

const props = defineProps({
  editMode: Boolean,
  product: Object,
  previewMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);
const { product: currentProduct } = toRefs(props);
const productStore = useProductStore();
const errors = ref({});

const submitProduct = async () => {
  errors.value = {}; // Reset errors

  const { name, stock, purshase_price, sale_price, safetyStock, barcode } =
    currentProduct.value;

  if (
    !name ||
    stock <= 0 ||
    purshase_price <= 0 ||
    sale_price <= 0 ||
    safetyStock <= 0 ||
    !barcode
  ) {
    errors.value = {
      name: !name ? "Name is required" : "",
      stock: stock <= 0 ? "Stock must be positive" : "",
      purshase_price:
        purshase_price <= 0 ? "Purchase price must be positive" : "",
      sale_price: sale_price <= 0 ? "Sale price must be positive" : "",
      safetyStock: safetyStock <= 0 ? "Safety stock must be positive" : "",
      barcode: !barcode ? "Barcode is required" : "",
    };
    toast.error("Please fill out all required fields correctly");
    return;
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
    if (error.response && error.response.data.errors) {
      error.response.data.errors.forEach((err) => {
        errors.value[err.param] = err.msg;
        toast.error(err.msg); // Affiche chaque message d'erreur spécifique
      });
    } else {
      toast.error("An error occurred while processing your request");
    }
  }
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
