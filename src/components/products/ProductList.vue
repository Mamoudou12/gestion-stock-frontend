<template>
  <div>
    <h2 class="text-primary mb-4">{{ $t("product_management") }}</h2>

    <button @click="openAddProductModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> {{ $t("add_product") }}
    </button>

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('search_product')"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">{{ $t('loading_products') }}</div>

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
            <h5 class="card-title">{{ product.name ?? $t('unnamed_product') }}</h5>
            <ul class="list-group list-group-flush mb-2">
              <li class="list-group-item">
                <strong>{{ $t('id') }}</strong> {{ product.id }}
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{{ $t('stock') }}</strong>
                <span class="badge bg-info">{{
                  product.stock ?? 0
                }}</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{{ $t('purchase_price') }}</strong>
                <span class="badge bg-primary"
                  >{{ parseFloat(product.purshase_price).toFixed(2) }} MRU</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{{ $t('sale_price') }}</strong>
                <span class="badge bg-success"
                  >{{ parseFloat(product.sale_price).toFixed(2) }} MRU</span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{{ $t('safety_stock') }}</strong>
                <span class="badge bg-danger">{{
                  product.safetyStock ?? 0
                }}</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <strong>{{ $t('barcode') }}</strong>
                <span class="barcode-color">{{
                  product.barcode ?? "N/A"
                }}</span>
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
              @click="deleteProduct(product.id)"
              class="btn btn-outline-danger btn-sm"
              :title="$t('delete')"
            >
              <i class="fas fa-trash"></i> 
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!loading && !filteredProducts.length"
      class="alert alert-warning"
    >
      {{ $t('no_products_found') }}
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
import Swal from "sweetalert2";
import ProductForm from "./ProductForm.vue";
import ProductView from "./ProductView.vue";

const productStore = useProductStore();
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
    title: $t('confirm_delete'),
    text: $t('delete_warning'),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: $t('confirm_delete_button'),
    cancelButtonText: "Cancel",
  });
  if (result.isConfirmed) {
    try {
      await productStore.deleteProduct(productId);
      Swal.fire({
        icon: "success",
        title: $t('deleted'),
        text: $t('product_deleted'),
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: $t('error'),
        text: $t('an_error_occurred'),
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
.search-input {
  width: 100%;
}
.barcode-color {
  color: green;
}
</style>
