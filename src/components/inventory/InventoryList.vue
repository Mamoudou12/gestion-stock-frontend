<template>
  <div>
    <div class="text-center">
      <h2 class="title">Inventory Management</h2>
    </div>
    <button @click="openAddInventoryModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> Add Inventory
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for an inventory item"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading inventory items...</div>

    <table
      class="table table-hover table-bordered"
      v-if="!loading && filteredInventory.length"
    >
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Remarks</th>
          <th>Product Name</th>
          <!-- Changed header to Product Name -->
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredInventory" :key="item.id">
          <td>{{ item.quantity }}</td>
          <td>{{ item.remarks }}</td>
          <td>{{ getProductName(item.productId) }}</td>
          <!-- Display product name -->
          <td>
            <div class="d-flex justify-content-center">
              <button
                @click="viewInventory(item)"
                class="btn btn-outline-primary me-2"
                title="View"
              >
                <i class="fas fa-eye"></i>
              </button>
              <!-- <button
              @click="editInventory(item)"
              class="btn btn-outline-warning me-2"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button> -->
              <button
                v-if="authStore.role === 'ADMIN'"
                @click="deleteInventory(item.id)"
                class="btn btn-outline-danger"
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !filteredInventory.length" class="alert alert-warning">
      No inventory items found.
    </div>

    <InventoryForm
      v-if="showModal"
      :inventory="currentInventory"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchInventory"
    />

    <InventoryDetailModal
      v-if="showDetailModal"
      :inventory="currentInventory"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInventoryStore } from "../../stores/inventoryStore";
import { useProductStore } from "../../stores/productStore"; // Import productStore
import { useAuthStore } from "../../stores/AuthStore";
import InventoryForm from "./InventoryForm.vue";
import InventoryDetailModal from "./InventoryView.vue";
import Swal from "sweetalert2";

const inventoryStore = useInventoryStore();
const authStore = useAuthStore();
const productStore = useProductStore(); // Initialize product store
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const showDetailModal = ref(false);
const editMode = ref(false);
const currentInventory = ref({ quantity: "", remarks: "", productId: "" });

onMounted(async () => {
  await fetchInventory();
});

// Fetch inventory items from the store
const fetchInventory = async () => {
  loading.value = true;
  await inventoryStore.fetchInventories();
  loading.value = false;
};

// Filter inventory items based on the search query
const filteredInventory = computed(() => {
  return inventoryStore.inventories.filter((item) =>
    item.productId.toString().includes(searchQuery.value.toLowerCase())
  );
});

// Get product name from productStore using product ID
const getProductName = (productId) => {
  const product = productStore.products.find((product) => product.id === productId);
  return product ? product.name : "Unknown Product"; // Return product name or a default message
};

const openAddInventoryModal = () => {
  currentInventory.value = { quantity: "", remarks: "", productId: "" };
  editMode.value = false;
  showModal.value = true;
};

const viewInventory = (item) => {
  currentInventory.value = { ...item };
  showDetailModal.value = true;
};

const editInventory = (item) => {
  currentInventory.value = { ...item };
  editMode.value = true;
  showModal.value = true;
};

const deleteInventory = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this inventory item!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await inventoryStore.deleteInventory(id);
      Swal.fire("Deleted!", "The inventory item has been deleted.", "success");
      fetchInventory();
    } catch (error) {
      console.error("Error during deletion:", error);
      Swal.fire("Error", "An error occurred during deletion", "error");
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
};
</script>

<style>
.search-input {
  max-width: 250px;
}

.table {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-family: "Georgia", serif;
  font-size: 2.8rem;
  font-weight: bold;
  color: #0056b3; /* Couleur de base du titre */
  background: linear-gradient(to right, #0056b3, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  display: inline-block;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}
.title:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
</style>
