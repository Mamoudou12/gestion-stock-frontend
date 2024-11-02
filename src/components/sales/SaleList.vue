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
          <th>Address</th>
          <th>Total Amount</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in filteredSales" :key="sale.id">
          <td>{{ sale.id }}</td>
          <td>{{ sale.firstName }} {{ sale.lastName }}</td>
          <td>{{ sale.address }}</td>
          <td>{{ calculateTotalAmount(sale.saleDetails).toFixed(2) }} MRU</td>
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

    <SaleForm
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

// Stores et références pour gérer les états
const saleStore = useSaleStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentSale = ref({
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: [],
  saleDate: "",
});

// Méthode pour charger les ventes
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

// Initialisation au chargement du composant
onMounted(fetchSales);

// Filtrer les ventes par recherche
const filteredSales = computed(() =>
  saleStore.sales.filter((sale) =>
    (sale.firstName + " " + sale.lastName)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

// Calculer le montant total pour chaque vente
const calculateTotalAmount = (saleDetails) => {
  return saleDetails.reduce((total, product) => total + product.quantity * product.price, 0);
};

// Ouvrir le modal pour ajouter une vente
const openAddSaleModal = () => {
  currentSale.value = {
    saleDate: "",
    firstName: "",
    lastName: "",
    address: "",
    saleDetails: [],
  };
  editMode.value = false;
  showModal.value = true;
};

// Voir les détails d'une vente
const viewSale = (sale) => {
  currentSale.value = { ...sale };
  showModal.value = true;
};

// Modifier une vente existante
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
