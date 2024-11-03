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
              min="0"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>Remarks:</label>
            <input v-model="inventory.remarks" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Product:</label>
            <select v-model="inventory.productId" required class="form-control">
              <option disabled value="">Select a product</option>
              <option
                v-for="product in products"
                :key="product.id"
                :value="product.id"
              >
                {{ product.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitInventory"
          >
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
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

const submitInventory = async () => {
  if (!props.inventory.quantity || !props.inventory.productId) {
    Swal.fire("Error", "Quantity and Product are required", "error");
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
    Swal.fire(
      "Error",
      error.response?.data?.message || "An error occurred",
      "error"
    );
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
</style>
