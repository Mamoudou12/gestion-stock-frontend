<template>
  <div>
    <h2 class="text-primary mb-4">Sales Management</h2>
    <button @click="openAddSaleModal" class="btn btn-danger mb-4">
      <i class="fas fa-plus"></i> Add Sale
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a sale"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading sales...</div>

    <table class="table table-bordered" v-if="!loading && filteredSales.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer Name</th>
          <th>Total Amount</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in filteredSales" :key="sale.id">
          <td>{{ sale.id }}</td>
          <td>{{ sale.firstName }} {{ sale.lastName }}</td>
          <td>{{ parseFloat(sale.totalAmount).toFixed(2) }} MRU</td>
          <td>{{ new Date(sale.saleDate).toLocaleDateString() }}</td>
          <td>
            <button
              @click="viewSale(sale)"
              class="btn btn-outline-info me-2"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editSale(sale)"
              class="btn btn-outline-warning me-2"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteSale(sale.id)"
              class="btn btn-outline-danger"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !filteredSales.length" class="alert alert-warning">
      No sales found.
    </div>

    <sale-form
      v-if="showModal"
      :sale="currentSale"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchSales"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useSaleStore } from "../../stores/saleStore";
import SaleForm from "./SaleForm.vue";
import Swal from "sweetalert2";

// Instances des stores et des références pour la gestion d'état
const saleStore = useSaleStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentSale = ref({ firstName: "", lastName: "", totalAmount: 0 });

// Méthode pour récupérer les ventes
const fetchSales = async () => {
  loading.value = true;
  try {
    await saleStore.fetchSales();
  } catch (error) {
    console.error("Error fetching sales:", error);
  } finally {
    loading.value = false;
  }
};

// Initialisation du composant
onMounted(fetchSales);

// Filtrage des ventes par recherche
const filteredSales = computed(() =>
  saleStore.sales.filter((sale) =>
    (sale.firstName + " " + sale.lastName)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

// Ouvrir le modal d'ajout
const openAddSaleModal = () => {
  currentSale.value = { firstName: "", lastName: "", totalAmount: 0 };
  editMode.value = false;
  showModal.value = true;
};

// Voir les détails d'une vente
const viewSale = (sale) => {
  currentSale.value = { ...sale };
  showModal.value = true;
};

// Modifier une vente
const editSale = (sale) => {
  currentSale.value = { ...sale };
  editMode.value = true;
  showModal.value = true;
};

// Supprimer une vente avec confirmation
const deleteSale = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this sale!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await saleStore.deleteSale(id);
      Swal.fire("Deleted!", "The sale has been deleted.", "success");
      fetchSales();
    } catch (error) {
      console.error("Error during deletion:", error);
      Swal.fire("Error", "An error occurred during deletion", "error");
    }
  }
};

// Fermer le modal
const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
};
</script>

<style scoped>
.search-input {
  max-width: 250px;
}
</style>
