<template>
  <div>
    <h2 class="text-primary mb-4">{{ $t("supplier_management") }}</h2>
    <button @click="openAddSupplierModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> {{ $t("add_supplier") }}
    </button>

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('search_supplier')"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">
      {{ $t("loading_suppliers") }}
    </div>

    <table
      class="table table-hover table-bordered"
      v-if="!loading && filteredSuppliers.length"
    >
      <thead>
        <tr>
          <th>{{ $t("id") }}</th>
          <th>{{ $t("email") }}</th>
          <th>{{ $t("phone") }}</th>
          <th>{{ $t("address") }}</th>
          <th>{{ $t("actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
          <td>{{ supplier.id }}</td>
          <td>{{ supplier.email }}</td>
          <td>{{ supplier.phone }}</td>
          <td>{{ supplier.address }}</td>
          <td>
            <div class="d-flex justify-content-center">
              <button
                @click="openViewSupplierModal(supplier)"
                class="btn btn-outline-primary me-2"
                :title="$t('view')"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="openEditSupplierModal(supplier)"
                class="btn btn-outline-warning me-2"
                :title="$t('edit')"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteSupplier(supplier.id)"
                class="btn btn-outline-danger"
                :title="$t('delete')"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="!loading && !filteredSuppliers.length"
      class="alert alert-warning"
    >
      {{ $t("no_suppliers") }}
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
    title: t("delete_confirmation"),
    text: t("delete_text"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: t("delete"),
  });

  if (result.isConfirmed) {
    try {
      await supplierStore.deleteSupplier(id);
      Swal.fire(t("deleted"), t("deletion_success"), "success");
      fetchSuppliers();
    } catch (error) {
      console.error("Error during deletion:", error);
      Swal.fire("Error", t("error_deletion"), "error");
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
