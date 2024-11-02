<template>
  <div>
    <h2 class="text-primary mb-4">Reception Management</h2>

    <button @click="openAddReceptionModal" class="btn btn-danger mb-4">
      <i class="fas fa-plus"></i> Add Reception
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a reception"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading receptions...</div>

    <table
      class="table table-bordered"
      v-if="!loading && filteredReceptions.length"
    >
      <thead>
        <tr>
          <th>Supplier</th>
          <th>Date</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reception in filteredReceptions" :key="reception.id">
          <td>{{ reception.supplier }}</td>
          <td>{{ reception.receptionDate }}</td>
          <td>{{ getProductName(reception.product) }}</td>
          <!-- Affichage du nom du produit -->
          <td>{{ reception.quantity }}</td>
          <td>{{ parseFloat(reception.price).toFixed(2) }} MRU</td>
          <td>
            <button
              @click="viewReception(reception)"
              class="btn btn-outline-info me-2"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editReception(reception)"
              class="btn btn-outline-warning me-2"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteReception(reception.id)"
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
      v-if="!loading && !filteredReceptions.length"
      class="alert alert-warning"
    >
      No receptions found.
    </div>

    <reception-form
      v-if="showModal"
      :reception="currentReception"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchReceptions"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useReceptionStore } from "../../stores/receptionStore";
import { useProductStore } from "../../stores/productStore"; // Importer le store des produits
import { useSupplierStore } from "../../stores/supplierStore"; // Importer le store des fournisseurs
import ReceptionForm from "./ReceptionForm.vue";
import Swal from "sweetalert2";

const receptionStore = useReceptionStore();
const productStore = useProductStore(); // Créer une instance du store des produits
const supplierStore = useSupplierStore(); // Créer une instance du store des fournisseurs
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentReception = ref({
  supplier: "",
  date: "",
  product: "",
  quantity: 0,
  price: "",
});

onMounted(async () => {
  await fetchReceptions();
});

// Fonction pour récupérer les réceptions
const fetchReceptions = async () => {
  loading.value = true;
  await receptionStore.fetchReceptions();
  console.log(receptionStore.receptions);
  loading.value = false;
};

// Filtrer les réceptions en fonction de la requête de recherche
const filteredReceptions = computed(() =>
  receptionStore.receptions
    .map((reception) => {
      const detail = reception.detailReceptions[0]; // Assurez-vous d'adapter si nécessaire
      return {
        id: reception.id,
        receptionDate: reception.receptionDate,
        supplierId: reception.supplierId,
        product: detail ? detail.productId : "", // Récupérer l'ID du produit
        quantity: detail ? detail.quantity : 0,
        price: detail ? detail.price : "",
        supplier:
          supplierStore.suppliers.find((s) => s.id === reception.supplierId)
            ?.email || "Unknown Supplier", // Utilisation de supplierStore pour obtenir le nom du fournisseur
      };
    })
    .filter(
      (reception) =>
        reception.supplierId &&
        reception.supplierId
          .toString()
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    )
);

// Fonction pour obtenir le nom du produit par son ID
const getProductName = (productId) => {
  const product = productStore.products.find((p) => p.id === productId);
  return product ? product.name : "Produit inconnu"; // Retourner 'Produit inconnu' si le produit n'est pas trouvé
};

const openAddReceptionModal = () => {
  currentReception.value = { supplier: "", date: "", product: "", quantity: 0 };
  editMode.value = false;
  showModal.value = true;
};

const viewReception = (reception) => {
  currentReception.value = { ...reception };
  showModal.value = true;
};

const editReception = (reception) => {
  currentReception.value = { ...reception };
  editMode.value = true;
  showModal.value = true;
};

const deleteReception = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this reception!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await receptionStore.deleteReception(id);
      Swal.fire("Deleted!", "The reception has been deleted.", "success");
      fetchReceptions();
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
