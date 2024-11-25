<template>
  <div class="modal show d-block" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Sale</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div class="mb-3 row">
            <!-- Date and First Name on the same line -->
            <div class="col-sm-6">
              <label for="sale_Date" class="col-form-label"> Sale Date: </label>
              <div class="input-group">
                <input
                  id="saleDate"
                  v-model="sale.saleDate"
                  class="form-control form-control-sm"
                  type="date"
                  :max="maxDate"
                  required
                />
              </div>
            </div>
            <div class="col-sm-6">
              <label for="firstName" class="col-form-label"> First Name: </label>
              <input
                id="firstName"
                v-model="sale.firstName"
                class="form-control"
                type="text"
                placeholder="Enter First Name"
              />
            </div>
          </div>

          <div class="mb-3 row">
            <!-- Address and Last Name on the same line -->
            <div class="col-sm-6">
              <label for="address" class="col-form-label"> Address: </label>
              <input
                id="address"
                v-model="sale.address"
                class="form-control"
                type="text"
                placeholder="Enter Address"
              />
            </div>
            <div class="col-sm-6">
              <label for="lastName" class="col-form-label"> Last Name: </label>
              <input
                id="lastName"
                v-model="sale.lastName"
                class="form-control"
                type="text"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div class="table-responsive mb-3">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in sale.saleDetails" :key="index">
                  <td>
                    <select
                      v-model="product.productId"
                      class="form-control"
                      @change="updateProductPrice(product)"
                    >
                      <option value="" disabled>Select Product</option>
                      <option v-for="prod in products" :key="prod.id" :value="prod.id">
                        {{ prod.name }}
                      </option>
                    </select>
                    <small v-if="!product.productId" class="text-danger">
                      Please select a product
                    </small>
                  </td>
                  <td>
                    <input
                      v-model="product.quantity"
                      class="form-control"
                      type="number"
                      min="1"
                      placeholder="Quantity"
                    />
                    <small v-if="product.error" class="text-danger">
                      {{ product.error }}
                    </small>
                  </td>
                  <td>
                    <input
                      v-model="product.price"
                      class="form-control"
                      type="number"
                      step="0.01"
                      readonly
                      placeholder="Price"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm w-100"
                      @click="removeProduct(index)"
                    >
                      Remove Product
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button type="button" class="btn btn-success btn-sm" @click="addProduct">
            Add Product
          </button>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" @click="close">
            Close
          </button>
          <button type="button" class="btn btn-primary btn-sm" @click="submitSale">
            Add Sale
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSaleStore } from "../../stores/saleStore";
import { useProductStore } from "../../stores/productStore";
import { useToast } from "vue-toastification";

const toast = useToast();

const emit = defineEmits(["close", "refresh"]);
const saleStore = useSaleStore();
const productStore = useProductStore();

const products = computed(() => productStore.products);

const sale = ref({
  saleDate: new Date().toISOString().split("T")[0], // Set default date to current date
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: [],
});

const errorMessage = ref("");

// Max date that can be selected (current date)
const maxDate = new Date().toISOString().split("T")[0];

// Function to add a product to the sale
const addProduct = () => {
  sale.value.saleDetails.push({
    productId: "",
    quantity: 1,
    price: 0.0,
    error: null, // To store error messages for each product
  });
};

// Function to remove a product from the sale
const removeProduct = (index) => {
  sale.value.saleDetails.splice(index, 1);
};

// Function to update the price when a product is selected
const updateProductPrice = (product) => {
  const selectedProduct = products.value.find((prod) => prod.id === product.productId);
  product.price = selectedProduct ? selectedProduct.sale_price : 0;
};

// Function to validate stock availability for each product
const validateStock = () => {
  let isStockValid = true;

  sale.value.saleDetails.forEach((product) => {
    const selectedProduct = products.value.find((prod) => prod.id === product.productId);
    if (selectedProduct && product.quantity > selectedProduct.stock) {
      product.error = `Insufficient stock. Only ${selectedProduct.stock} available.`;
      isStockValid = false;
    } else {
      product.error = null; // Clear error if stock is sufficient
    }
  });

  return isStockValid;
};

// Function to submit the sale
const submitSale = async () => {
  const { saleDate, firstName, lastName, address, saleDetails } = sale.value;

  if (saleDetails.length === 0) {
    toast.error("At least one product is required");
    return;
  }

  // Validate stock before proceeding
  if (!validateStock()) {
    toast.error("Some products have insufficient stock.");
    return;
  }

  try {
    await saleStore.createSale(sale.value);
    toast.success("Sale added successfully");
    emit("refresh");
    emit("close");
  } catch (error) {
    toast.error("Error saving sale");
    console.error(error);
  }
};

// Close the modal
const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal-dialog {
  max-width: 70%;
}

.form-control,
.btn {
  height: 36px;
}

.table td input {
  width: 100%;
  height: 36px;
}

.input-group .input-group-text {
  background-color: #fff;
  border-left: 0;
  padding: 0.375rem 0.75rem;
  font-size: 1.1rem;
}

.input-group .form-control {
  border-right: 0;
}
</style>
