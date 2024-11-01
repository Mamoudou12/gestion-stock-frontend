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
          <!-- <th>Supplier</th> -->
          <th>Date</th>
          <!-- <th>Product</th> -->
          <th>Quantity</th>
          <th>price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reception in filteredReceptions" :key="reception.id">
          <!-- <td>{{ reception.supplier }}</td> -->
          <td>{{ reception.receptionDate }}</td>
          <!-- <td>{{ reception.product }}</td> -->
          <td>{{ reception.quantity }}</td>
          <td>{{ reception.price }}</td>
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
import ReceptionForm from "./ReceptionForm.vue";
import Swal from "sweetalert2";

const receptionStore = useReceptionStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentReception = ref({
  supplier: "",
  date: "",
  product: "",
  quantity: 0,
  price:"",
});

onMounted(async () => {
  await fetchReceptions();
});

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
      const detail = reception.detailReceptions[0]; // Assure-toi d'adapter si nécessaire
      return {
        id: reception.id,
        receptionDate: reception.receptionDate,
        supplierId: reception.supplierId,
        product: detail ? detail.productId : "", 
        quantity: detail ? detail.quantity : 0,
        price: detail ? detail.price : "",
        supplier: reception.supplierId, // Remplace avec le nom du fournisseur si disponible
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
