<template>
  <div class="modal show d-block" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Sale</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3 row">
            <div class="col-sm-6">
              <label for="saleDate" class="col-form-label">Sale Date:</label>
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
              <small v-if="validationErrors.saleDate" class="text-danger">
                {{ validationErrors.saleDate }}
              </small>
            </div>

            <div class="col-sm-6">
              <label for="firstName" class="col-form-label">First Name:</label>
              <input
                id="firstName"
                v-model="sale.firstName"
                class="form-control"
                type="text"
                maxlength="100"
                placeholder="Enter First Name"
              />
              <small v-if="validationErrors.firstName" class="text-danger">
                {{ validationErrors.firstName }}
              </small>
            </div>
          </div>

          <div class="mb-3 row">
            <div class="col-sm-6">
              <label for="address" class="col-form-label">Address:</label>
              <input
                id="address"
                v-model="sale.address"
                class="form-control"
                type="text"
                maxlength="50"
                placeholder="Enter Address"
              />
              <small v-if="validationErrors.address" class="text-danger">
                {{ validationErrors.address }}
              </small>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="col-form-label">Last Name:</label>
              <input
                id="lastName"
                v-model="sale.lastName"
                class="form-control"
                type="text"
                maxlength="100"
                placeholder="Enter Last Name"
              />
              <small v-if="validationErrors.lastName" class="text-danger">
                {{ validationErrors.lastName }}
              </small>
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
                      Please select a product.
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
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button type="button" class="btn btn-success btn-sm" @click="addProduct">
            Add Product
          </button>
          <small v-if="validationErrors.saleDetails" class="text-danger">
            {{ validationErrors.saleDetails }}
          </small>
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
  saleDate: new Date().toISOString().split("T")[0],
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: [],
});

const validationErrors = ref({
  saleDate: "",
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: "",
});

const maxDate = new Date().toISOString().split("T")[0];

const validateInputs = () => {
  let isValid = true;

  if (!sale.value.saleDate) {
    validationErrors.value.saleDate = "Sale date is required.";
    isValid = false;
  } else {
    validationErrors.value.saleDate = "";
  }

  if (sale.value.firstName.length > 100) {
    validationErrors.value.firstName = "First name cannot exceed 100 characters.";
    isValid = false;
  } else {
    validationErrors.value.firstName = "";
  }

  if (sale.value.lastName.length > 100) {
    validationErrors.value.lastName = "Last name cannot exceed 100 characters.";
    isValid = false;
  } else {
    validationErrors.value.lastName = "";
  }

  if (sale.value.address.length > 50) {
    validationErrors.value.address = "Address cannot exceed 50 characters.";
    isValid = false;
  } else {
    validationErrors.value.address = "";
  }

  if (sale.value.saleDetails.length === 0) {
    validationErrors.value.saleDetails = "At least one product is required.";
    isValid = false;
  } else {
    validationErrors.value.saleDetails = "";
    sale.value.saleDetails.forEach((product) => {
      if (!product.productId || product.quantity <= 0) {
        product.error = "Invalid product selection or quantity.";
        isValid = false;
      } else {
        product.error = null;
      }
    });
  }

  return isValid;
};

const addProduct = () => {
  sale.value.saleDetails.push({
    productId: "",
    quantity: 1,
    price: 0.0,
    error: null,
  });
};

const removeProduct = (index) => {
  sale.value.saleDetails.splice(index, 1);
};

const updateProductPrice = (product) => {
  const selectedProduct = products.value.find((prod) => prod.id === product.productId);
  product.price = selectedProduct ? selectedProduct.sale_price : 0;
};

const submitSale = async () => {
  if (!validateInputs()) {
    toast.error("Please fix the errors before submitting.");
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

const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal-dialog {
  max-width: 70%;
}
</style>
