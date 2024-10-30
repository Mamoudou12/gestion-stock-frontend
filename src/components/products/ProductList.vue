<template>
  <div>
    <h2 class="text-primary mb-4">Product Management</h2>

    <button @click="openAddProductModal" class="btn btn-danger mb-4">
      <i class="fas fa-plus"></i> Add Product
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a product"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading products...</div>

    <table
      class="table table-bordered"
      v-if="!loading && filteredProducts.length"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
          <th>Purchase Price</th>
          <th>Sale Price</th>
          <th>Safety Stock</th>
          <th>Barcode</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.purchase_price }}</td>
          <td>{{ product.sale_price }}</td>
          <td>{{ product.safetyStock }}</td>
          <td>{{ product.barcode }}</td>
          <td>
            <button
              @click="viewProduct(product)"
              class="btn btn-outline-info me-2"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editProduct(product)"
              class="btn btn-outline-warning me-2"
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
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="!loading && !filteredProducts.length"
      class="alert alert-warning"
    >
      No products found.
    </div>

    <ProductForm
      v-if="showModal"
      :edit-mode="editMode"
      :product="currentProduct"
      @close="closeModal"
      @refresh="refreshProducts"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "../../stores/productStore";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm.vue"; // Import the ProductForm component

const productStore = useProductStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentProduct = ref({});

onMounted(async () => {
  await productStore.fetchProducts();
  loading.value = false;
});

const filteredProducts = computed(() =>
  productStore.products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const openAddProductModal = () => {
  currentProduct.value = {
    name: "",
    stock: 0,
    purchase_price: 0.0,
    sale_price: 0.0,
    safetyStock: 0,
    barcode: "",
  };
  editMode.value = false;
  showModal.value = true;
};

const viewProduct = (product) => {
  currentProduct.value = { ...product };
  showModal.value = true;
  editMode.value = false; // Set view mode
};

const editProduct = (product) => {
  currentProduct.value = { ...product };
  editMode.value = true;
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
};

const refreshProducts = async () => {
  await productStore.fetchProducts();
};
</script>

<style>
.search-input {
  max-width: 250px;
}
</style>
