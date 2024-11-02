<template>
  <div class="sale-view">
    <h3>Sales Overview</h3>

    <!-- Display each sale in a card format -->
    <div v-for="sale in sales" :key="sale.id" class="card mb-3">
      <div class="card-header">
        <h5>
          Sale ID: {{ sale.id }}
          <span class="sale-date">{{ sale.saleDate }}</span>
        </h5>
      </div>

      <div class="card-body">
        <p>
          <strong>Customer Name:</strong> {{ sale.firstName }}
          {{ sale.lastName }}
        </p>
        <p><strong>Address:</strong> {{ sale.address }}</p>

        <!-- Product details for each sale -->
        <h6>Products</h6>
        <div
          class="product-details"
          v-for="(product, index) in sale.saleDetails"
          :key="index"
        >
          <p><strong>Product ID:</strong> {{ product.productId }}</p>
          <p><strong>Quantity:</strong> {{ product.quantity }}</p>
          <p><strong>Price:</strong> ${{ product.price.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Action buttons for editing or deleting a sale -->
      <div class="card-footer">
        <button class="btn btn-primary me-2" @click="editSale(sale)">
          Edit
        </button>
        <button class="btn btn-danger" @click="deleteSale(sale.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSaleStore } from "../../stores/saleStore";
import Swal from "sweetalert2";

// Get sales data from store
const saleStore = useSaleStore();
const sales = ref([]);

// Fetch sales data on component mount
const fetchSales = async () => {
  try {
    sales.value = await saleStore.getSales();
  } catch (error) {
    Swal.fire("Error", "Failed to load sales data", "error");
  }
};

// Edit a sale
const editSale = (sale) => {
  // Trigger edit action, such as opening an edit modal
  saleStore.setEditSale(sale);
};

// Delete a sale
const deleteSale = async (id) => {
  const confirmed = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the sale.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (confirmed.isConfirmed) {
    try {
      await saleStore.deleteSale(id);
      Swal.fire("Deleted!", "Sale has been deleted.", "success");
      fetchSales(); // Refresh the list after deletion
    } catch (error) {
      Swal.fire("Error", "Failed to delete sale", "error");
    }
  }
};

// Fetch sales when component is mounted
onMounted(fetchSales);
</script>

<style scoped>
.sale-view {
  padding: 20px;
}

.card {
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sale-date {
  float: right;
  font-size: 0.9em;
  color: #666;
}

.product-details {
  padding: 10px;
  border-top: 1px solid #eee;
  margin-top: 10px;
}

.card-footer {
  text-align: right;
}
</style>
