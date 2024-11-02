<template>
  <div>
    <h2 class="text-primary mb-4">Product Management</h2>

    <button @click="openAddProductModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> Add Product
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a product"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading products...</div>

    <div
      v-if="!loading && filteredProducts.length"
      class="row row-cols-1 row-cols-md-3 g-4"
    >
      <div class="col" v-for="product in filteredProducts" :key="product.id">
        <div class="card h-100 shadow-sm" style="width: 100%; max-width: 400px">
          <div class="card-body">
            <h5 class="card-title">{{ product.name ?? "Unnamed Product" }}</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <strong>ID:</strong> {{ product.id }}
              </li>
              <li class="list-group-item">
                <strong>Stock:</strong> {{ product.stock ?? 0 }}
              </li>
              <li class="list-group-item">
                <strong>Purchase Price:</strong>
                {{ parseFloat(product.purshase_price).toFixed(2) }} MRU
              </li>
              <li class="list-group-item">
                <strong>Sale Price:</strong>
                {{ parseFloat(product.sale_price).toFixed(2) }} MRU
              </li>
              <li class="list-group-item text-danger">
                <strong>Safety Stock:</strong> {{ product.safetyStock ?? 0 }}
              </li>
              <li class="list-group-item">
                <strong>Barcode:</strong>
                <span class="barcode-color">{{
                  product.barcode ?? "N/A"
                }}</span>
              </li>
            </ul>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button
              @click="viewProduct(product)"
              class="btn btn-outline-primary"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editProduct(product)"
              class="btn btn-outline-warning"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="btn btn-outline-danger"
              title="Delete"
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
      No products found.
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
import ProductView from "./ProductView.vue"; // Import du composant de prévisualisation

const productStore = useProductStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const viewMode = ref(false); // Nouveau mode pour l'aperçu
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
  currentProduct.value = { ...product };
  showModal.value = true;
  viewMode.value = true;
};

const editProduct = (product) => {
  currentProduct.value = { ...product };
  editMode.value = true;
  viewMode.value = false;
  showModal.value = true;
};

const deleteProduct = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await productStore.deleteProduct(id);
      Swal.fire("Deleted!", "Product has been deleted.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "An error occurred", "error");
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  viewMode.value = false; // Réinitialiser le mode aperçu
};

const refreshProducts = async () => {
  await productStore.fetchProducts();
};
</script>
