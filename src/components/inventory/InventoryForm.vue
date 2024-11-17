<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Inventory</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Quantity:</label>
            <input
              v-model="inventory.quantity"
              required
              type="number"
              min="1"
              class="form-control"
            />
            <small v-if="quantityError" class="text-danger">{{ quantityError }}</small>
          </div>
          <div class="mb-3">
            <label>Remarks:</label>
            <input v-model="inventory.remarks" class="form-control" />
            <small v-if="remarksError" class="text-danger">{{ remarksError }}</small>
          </div>
          <div class="mb-3">
            <label>Product:</label>
            <select v-model="inventory.productId" required class="form-control">
              <option disabled value="">Select a product</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
            <small v-if="productError" class="text-danger">{{ productError }}</small>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
          <button type="button" class="btn btn-primary" @click="submitInventory">
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useInventoryStore } from "../../stores/inventoryStore";
import { useProductStore } from "../../stores/productStore"; // Import the product store
import Swal from "sweetalert2";

const props = defineProps({
  inventory: Object,
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);

const inventoryStore = useInventoryStore();
const productStore = useProductStore(); // Initialize product store

// Error states
const quantityError = ref("");
const remarksError = ref("");
const productError = ref("");

const submitInventory = async () => {
  // Reset errors before validation
  quantityError.value = "";
  remarksError.value = "";
  productError.value = "";

  // Validate if quantity and product are provided
  if (!props.inventory.quantity || props.inventory.quantity <= 0) {
    quantityError.value = "Quantity must be a positive number";
  }

  if (!props.inventory.productId) {
    productError.value = "At least one product must be selected";
  }

  // If there are validation errors, stop form submission
  if (quantityError.value || productError.value) {
    return;
  }

  try {
    if (props.editMode) {
      await inventoryStore.updateInventory(props.inventory.id, props.inventory);
      Swal.fire("Success", "Inventory updated successfully", "success");
    } else {
      await inventoryStore.createInventory(props.inventory);
      Swal.fire("Success", "Inventory added successfully", "success");
      // Reset the inventory object for adding a new entry
      Object.assign(props.inventory, {
        quantity: "",
        remarks: "",
        productId: "",
      });
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during add/update:", error);
    Swal.fire("Error", error.response?.data?.message || "An error occurred", "error");
  } finally {
    close();
  }
};

const close = () => {
  emit("close");
};

// Fetch products on mount
const products = ref([]);
const fetchProducts = async () => {
  await productStore.fetchProducts();
  products.value = productStore.products; // Assign products from the store
};

// Call fetch on setup
fetchProducts();
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.text-danger {
  color: red;
}
</style>
