<template>
  <div>
    <h2 class="text-primary mb-4">Inventory Management</h2>
    <button @click="openAddInventoryModal" class="btn btn-danger mb-4">
      <i class="fas fa-plus"></i> Add Inventory
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for an inventory item"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">
      Loading inventory items...
    </div>

    <table
      class="table table-bordered"
      v-if="!loading && filteredInventory.length"
    >
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Remarks</th>
          <th>Product ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredInventory" :key="item.id">
          <td>{{ item.quantity }}</td>
          <td>{{ item.remarks }}</td>
          <td>{{ item.productId }}</td>
          <td>
            <button
              @click="viewInventory(item)"
              class="btn btn-outline-info me-2"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editInventory(item)"
              class="btn btn-outline-warning me-2"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteInventory(item.id)"
              class="btn btn-outline-danger"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="!loading && !filteredInventory.length"
      class="alert alert-warning"
    >
      No inventory items found.
    </div>

    <InventoryForm
      v-if="showModal"
      :inventory="currentInventory"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchInventory"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInventoryStore } from "../../stores/inventoryStore";
import InventoryForm from "./InventoryForm.vue";
import Swal from "sweetalert2";

const inventoryStore = useInventoryStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentInventory = ref({ quantity: "", remarks: "", productId: "" });

onMounted(async () => {
  try {
    console.log("Initializing inventory fetch...");
    await fetchInventory();
  } catch (error) {
    console.error("Error during initial fetch:", error);
  }
});

const fetchInventory = async () => {
  loading.value = true;
  await inventoryStore.fetchInventories();
  loading.value = false;
};

const filteredInventory = computed(() => {
  console.log("Inventory data:", inventoryStore.inventories);
  if (!inventoryStore.inventories) return [];
  return inventoryStore.inventories.filter((item) =>
    item.productId.toString().includes(searchQuery.value.toLowerCase())
  );
});

const openAddInventoryModal = () => {
  currentInventory.value = { quantity: "", remarks: "", productId: "" };
  editMode.value = false;
  showModal.value = true;
};

const viewInventory = (item) => {
  currentInventory.value = { ...item };
  showModal.value = true;
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
</style>
