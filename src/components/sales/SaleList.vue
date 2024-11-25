html Copier le code
<template>
  <div>
    <div class="text-center">
      <h2 class="title">{{ $t("salesManagement") }}</h2>
    </div>
    <button @click="openAddSaleModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> {{ $t("addSale") }}
    </button>

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('searchSale')"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">{{ $t("loadingSales") }}</div>

    <table
      class="table table-hover table-bordered"
      v-if="!loading && filteredSales.length"
    >
      <thead>
        <tr>
          <th>{{ $t("id") }}</th>
          <th>{{ $t("customerName") }}</th>
          <th>{{ $t("address") }}</th>
          <th>{{ $t("products") }}</th>
          <th>{{ $t("totalAmount") }}</th>
          <th>{{ $t("date") }}</th>
          <th>{{ $t("actions") }}</th>
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
            <div class="d-flex justify-content-center">
              <button
                @click="viewDetail(sale, 'Sale')"
                class="btn btn-outline-primary me-2"
                :title="$t('viewDetails')"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                v-if="authStore.role === 'ADMIN'"
                @click="deleteSale(sale.id)"
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

    <div v-if="!loading && !filteredSales.length" class="alert alert-warning">
      {{ $t("noSalesFound") }}
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
              {{ modalContext }} {{ $t("saleDetails") }}
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
                {{ $t("customerName") }}: {{ selectedDetail.firstName }}
                {{ selectedDetail.lastName }}
              </h6>
              <p>{{ $t("address") }}: {{ selectedDetail.address }}</p>
              <p>
                {{ $t("date") }}:
                {{ new Date(selectedDetail.saleDate).toLocaleDateString() }}
              </p>

              <h6>{{ $t("saleDetails") }}:</h6>
              <ul class="list-group">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="item in selectedDetail.details"
                  :key="item.productId"
                >
                  <div>
                    <strong>{{ $t("products") }}:</strong> {{ item.productName }}<br />
                    <strong>{{ $t("quantity") }}:</strong> {{ item.quantity }}<br />
                    <strong>{{ $t("price") }}:</strong> {{ item.price }} MRU
                  </div>
                  <span class="badge bg-primary rounded-pill">
                    {{ (item.quantity * item.price).toFixed(2) }} MRU
                  </span>
                </li>
              </ul>
              <p class="mt-3 text-end">
                <strong>
                  {{ $t("totalAmount") }}:
                  {{ calculateTotalAmount(selectedDetail.details).toFixed(2) }}
                  MRU
                </strong>
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ $t("close") }}
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
import { useAuthStore } from "../../stores/authStore";
import Swal from "sweetalert2";
import SaleForm from "./SaleForm.vue";
import * as bootstrap from "bootstrap";
import { useI18n } from "vue-i18n"; // Importer useI18n pour les traductions

const { t } = useI18n();

const saleStore = useSaleStore();
const productStore = useProductStore();
const authStore = useAuthStore();
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
      await saleStore.deleteSale(id);
      Swal.fire("Deleted!", t("deletion_success"), "success");
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
