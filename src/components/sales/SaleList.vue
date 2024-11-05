<template>
  <div>
    <h2 class="text-primary mb-4">Sales Management</h2>
    <button @click="openAddSaleModal" class="btn btn-primary mb-4">
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
          <th>Products</th>
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
          <td>{{ getProductNames(sale.saleDetails) }}</td>
          <td>{{ calculateTotalAmount(sale.saleDetails).toFixed(2) }} MRU</td>
          <td>{{ new Date(sale.saleDate).toLocaleDateString() }}</td>
          <td>
            <button
              @click="viewDetail(sale, 'Sale')"
              class="btn btn-outline-info me-2"
              title="View Details"
            >
              <i class="fas fa-eye"></i>
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

    <!-- Modal pour afficher les détails de la vente -->
    <div
      class="modal fade"
      id="detailModal"
      tabindex="-1"
      aria-labelledby="detailLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="detailLabel">
              {{ modalContext }} Details
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedDetail">
              <h6>
                Customer Name: {{ selectedDetail.firstName }}
                {{ selectedDetail.lastName }}
              </h6>
              <p>Address: {{ selectedDetail.address }}</p>
              <p>
                Date:
                {{ new Date(selectedDetail.saleDate).toLocaleDateString() }}
              </p>

              <h6>Sale Details:</h6>
              <ul class="list-group">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="item in selectedDetail.details"
                  :key="item.productId"
                >
                  <div>
                    <strong>Product:</strong> {{ item.productName }}<br />
                    <strong>Quantity:</strong> {{ item.quantity }}<br />
                    <strong>Price:</strong> {{ item.price }} MRU
                  </div>
                  <span class="badge bg-primary rounded-pill">
                    {{ (item.quantity * item.price).toFixed(2) }} MRU
                  </span>
                </li>
              </ul>
              <p class="mt-3 text-end">
                <strong
                  >Total Amount:
                  {{ calculateTotalAmount(selectedDetail.details).toFixed(2) }}
                  MRU</strong
                >
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter une vente -->
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
import { useProductStore } from "../../stores/productStore";
import Swal from "sweetalert2";
import SaleForm from "./SaleForm.vue";
import * as bootstrap from "bootstrap";

const saleStore = useSaleStore();
const productStore = useProductStore();
const searchQuery = ref("");
const loading = ref(true);
const modalContext = ref("");
const selectedDetail = ref(null);
const showModal = ref(false);
const editMode = ref(false);
const currentSale = ref({
  saleDate: "",
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: [],
});

let detailModal = null;

const fetchSales = async () => {
  loading.value = true;
  try {
    await saleStore.fetchSales();
    await productStore.fetchProducts();
  } catch (error) {
    console.error("Error fetching sales or products:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSales();
  detailModal = new bootstrap.Modal(document.getElementById("detailModal"));
});

const filteredSales = computed(() =>
  saleStore.sales.filter((sale) =>
    (sale.firstName + " " + sale.lastName)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

const calculateTotalAmount = (details) =>
  details.reduce((total, item) => total + item.quantity * item.price, 0);

const getProductNames = (details) =>
  details
    .map((item) => {
      const product = productStore.products.find(
        (product) => product.id === item.productId
      );
      return product ? product.name : "Unknown Product";
    })
    .join(", ");

const openAddSaleModal = () => {
  currentSale.value = {
    saleDate: "",
    firstName: "",
    lastName: "",
    address: "",
    saleDetails: [],
  };
  editMode.value = false; // Mode d'édition désactivé
  showModal.value = true; // Ouvrir le modal
};

const closeModal = () => {
  showModal.value = false; // Fermer le modal
};

const viewDetail = (detail, context) => {
  selectedDetail.value = {
    ...detail,
    details: detail.saleDetails.map((item) => ({
      ...item,
      productName: getProductNames([item]),
    })),
  };
  modalContext.value = context;
  detailModal.show();
};

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
</script>

<style scoped>
.search-input {
  max-width: 250px;
}
.modal-md {
  max-width: 600px;
}
.list-group-item {
  padding: 0.75rem 1rem;
}
.badge {
  font-size: 1rem;
}
</style>
