<template>
  <div>
    <div class="text-center">
      <h2 class="title">{{ $t("product_management") }}</h2>
    </div>

    <button @click="openAddProductModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> {{ $t("add_product") }}
    </button>

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('search_product')"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">
      {{ $t("loading_products") }}
    </div>

    <div
      v-if="!loading && filteredProducts.length"
      class="row row-cols-1 row-cols-md-3 g-4"
    >
      <div class="col" v-for="product in filteredProducts" :key="product.id">
        <div
          class="card h-100 shadow-sm rounded"
          style="width: 100%; max-width: 400px; border-radius: 15px"
        >
          <div class="card-body">
            <h5 class="card-title">
              <strong>{{ product.name ?? $t("unnamed_product") }}</strong>
            </h5>
            <ul class="list-group list-group-flush mb-2">
              <li class="list-group-item">{{ $t("id") }} {{ product.id }}</li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ $t("stock") }}
                <span class="badge bg-info">{{ product.stock ?? 0 }}</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ $t("purchase_price") }}
                <span class="badge bg-primary"
                  >{{ parseFloat(product.purshase_price).toFixed(2) }} MRU</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ $t("sale_price") }}
                <span class="badge bg-success"
                  >{{ parseFloat(product.sale_price).toFixed(2) }} MRU</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ $t("safety_stock") }}
                <span class="badge bg-danger">{{ product.safetyStock ?? 0 }}</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ $t("barcode") }}
                <span class="barcode-color">{{ product.barcode ?? "N/A" }}</span>
              </li>
            </ul>
          </div>
          <div class="card-footer d-flex justify-content-around">
            <button
              @click="viewProduct(product)"
              class="btn btn-outline-primary btn-sm"
              :title="$t('view')"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editProduct(product)"
              class="btn btn-outline-warning btn-sm me-2"
              :title="$t('edit')"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              v-if="authStore.role === 'ADMIN'"
              @click="deleteProduct(product.id)"
              class="btn btn-outline-danger btn-sm"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !filteredProducts.length" class="alert alert-warning">
      {{ $t("no_products_found") }}
    </div>

    <!-- Modal pour l'ajout ou l'édition d'un produit -->
    <ProductForm
      v-if="showModal && !viewMode"
      :edit-mode="editMode"
      :product="currentProduct"
      @close="closeModal"
      @refresh="refreshProducts"
    />

    <!-- Modal pour l'aperçu d'un produit -->
    <ProductView
      v-if="showModal && viewMode"
      :product="currentProduct"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../../stores/productStore";
import { useAuthStore } from "../../stores/AuthStore";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm.vue";
import ProductView from "./ProductView.vue";

const productStore = useProductStore();
const authStore = useAuthStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const viewMode = ref(false);
const currentProduct = ref({});

const cleanProduct = (product) => ({
  id: product.id ?? null,
  name: product.name ?? "Unnamed Product",
  stock: product.stock ?? 0,
  purshase_price: product.purshase_price ?? 0.0,
  sale_price: product.sale_price ?? 0.0,
  safetyStock: product.safetyStock ?? 0,
  barcode: product.barcode ?? "N/A",
});

onMounted(async () => {
  await productStore.fetchProducts();
  loading.value = false;
});

const filteredProducts = computed(() =>
  productStore.products
    .map(cleanProduct)
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

const openAddProductModal = () => {
  currentProduct.value = {
    id: null,
    name: "",
    stock: 0,
    purshase_price: 0.0,
    sale_price: 0.0,
    safetyStock: 0,
    barcode: "",
  };
  editMode.value = false;
  viewMode.value = false;
  showModal.value = true;
};

const viewProduct = (product) => {
  currentProduct.value = cleanProduct(product);
  editMode.value = false;
  viewMode.value = true;
  showModal.value = true;
};

const editProduct = (product) => {
  currentProduct.value = cleanProduct(product);
  editMode.value = true;
  viewMode.value = false;
  showModal.value = true;
};

const deleteProduct = async (productId) => {
  const result = await Swal.fire({
    title: "Confirm Deletion",
    text: "Are you sure you want to delete this product?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      await productStore.deleteProduct(productId);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The product has been deleted.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while deleting the product.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  }
};

const closeModal = () => {
  showModal.value = false;
};

const refreshProducts = async () => {
  loading.value = true;
  await productStore.fetchProducts();
  loading.value = false;
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
}

.card-footer {
  background: #f8f9fa;
  padding: 10px;
  text-align: center;
}

.badge {
  font-size: 0.85rem;
  font-weight: bold;
}

.card h5 {
  color: #0056b3;
  text-transform: uppercase;
}

.list-group-item {
  font-size: 0.9rem;
  background-color: #ffffff;
  border: none;
}

.btn-outline-primary,
.btn-outline-warning,
.btn-outline-danger {
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #0056b3;
  color: white;
}

.btn-outline-warning:hover {
  background: #ffc107;
  color: white;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
}

.barcode-color {
  font-weight: bold;
  font-family: "Courier New", Courier, monospace;
  color: #28a745;
}

.search-input {
  width: 100%;
}
.barcode-color {
  color: green;
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
  /* border: 2px solid #000000; */
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
