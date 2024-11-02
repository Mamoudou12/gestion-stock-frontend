<template>
  <div>
    <h2 class="text-primary mb-4">Supplier Management</h2>
    <button @click="openAddSupplierModal" class="btn btn-danger mb-4">
      <i class="fas fa-plus"></i> Add Supplier
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a supplier"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading suppliers...</div>

    <table
      class="table table-bordered"
      v-if="!loading && filteredSuppliers.length"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
          <td>{{ supplier.id }}</td>
          <td>{{ supplier.email }}</td>
          <td>{{ supplier.phone }}</td>
          <td>{{ supplier.address }}</td>
          <td>
            <button
              @click="openViewSupplierModal(supplier)"
              class="btn btn-outline-info me-2"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="openEditSupplierModal(supplier)"
              class="btn btn-outline-warning me-2"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteSupplier(supplier.id)"
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
      v-if="!loading && !filteredSuppliers.length"
      class="alert alert-warning"
    >
      No suppliers found.
    </div>

    <!-- Formulaire d'ajout/édition de fournisseur -->
    <supplier-form
      v-if="showFormModal"
      :supplier="currentSupplier"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchSuppliers"
    />

    <!-- Vue d'aperçu pour le fournisseur sélectionné -->
    <supplier-view
      v-if="showViewModal"
      :supplier="currentSupplier"
      @close="closeViewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useSupplierStore } from "../../stores/supplierStore";
import SupplierForm from "./SupplierForm.vue";
import SupplierView from "./SupplierView.vue";
import Swal from "sweetalert2";

const supplierStore = useSupplierStore();
const searchQuery = ref("");
const loading = ref(true);
const showFormModal = ref(false);
const showViewModal = ref(false);
const editMode = ref(false);
const currentSupplier = ref({ email: "", phone: "", address: "" });

onMounted(async () => {
  await fetchSuppliers();
});

const fetchSuppliers = async () => {
  loading.value = true;
  await supplierStore.fetchSuppliers();
  loading.value = false;
};

const filteredSuppliers = computed(() =>
  supplierStore.suppliers.filter((supplier) =>
    supplier.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const openAddSupplierModal = () => {
  currentSupplier.value = { email: "", phone: "", address: "" };
  editMode.value = false;
  showFormModal.value = true;
};

const openViewSupplierModal = (supplier) => {
  currentSupplier.value = { ...supplier };
  showViewModal.value = true;
};

const openEditSupplierModal = (supplier) => {
  currentSupplier.value = { ...supplier };
  editMode.value = true;
  showFormModal.value = true;
};

const deleteSupplier = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this supplier!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await supplierStore.deleteSupplier(id);
      Swal.fire("Deleted!", "The supplier has been deleted.", "success");
      fetchSuppliers();
    } catch (error) {
      console.error("Error during deletion:", error);
      Swal.fire("Error", "An error occurred during deletion", "error");
    }
  }
};

const closeModal = () => {
  showFormModal.value = false;
  editMode.value = false;
};

const closeViewModal = () => {
  showViewModal.value = false;
};
</script>

<style>
.search-input {
  max-width: 250px;
}
</style>
