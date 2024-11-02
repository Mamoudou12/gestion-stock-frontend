<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Sale</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <!-- Display error messages -->
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div class="mb-3 row">
            <label for="saleDate" class="col-sm-3 col-form-label"
              >Sale Date:</label
            >
            <div class="col-sm-9">
              <DatePicker
                v-model="sale.saleDate"
                :format="'YYYY-MM-DD'"
                :clearable="true"
                :editable="true"
                class="form-control"
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="firstName" class="col-sm-3 col-form-label"
              >First Name:</label
            >
            <div class="col-sm-9">
              <input
                id="firstName"
                v-model="sale.firstName"
                required
                class="form-control"
                type="text"
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="lastName" class="col-sm-3 col-form-label"
              >Last Name:</label
            >
            <div class="col-sm-9">
              <input
                id="lastName"
                v-model="sale.lastName"
                required
                class="form-control"
                type="text"
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="address" class="col-sm-3 col-form-label"
              >Address:</label
            >
            <div class="col-sm-9">
              <input
                id="address"
                v-model="sale.address"
                required
                class="form-control"
                type="text"
              />
            </div>
          </div>

          <!-- Product Details -->
          <div
            v-for="(product, index) in sale.saleDetails"
            :key="index"
            class="product-entry mb-3"
          >
            <h6>Product {{ index + 1 }}</h6>

            <div class="row">
              <label :for="'productId-' + index" class="col-sm-3 col-form-label"
                >Product ID:</label
              >
              <div class="col-sm-9">
                <input
                  :id="'productId-' + index"
                  v-model="product.productId"
                  required
                  class="form-control"
                  type="number"
                />
              </div>
            </div>

            <div class="row">
              <label :for="'quantity-' + index" class="col-sm-3 col-form-label"
                >Quantity:</label
              >
              <div class="col-sm-9">
                <input
                  :id="'quantity-' + index"
                  v-model="product.quantity"
                  required
                  class="form-control"
                  type="number"
                />
              </div>
            </div>

            <div class="row">
              <label :for="'price-' + index" class="col-sm-3 col-form-label"
                >Price:</label
              >
              <div class="col-sm-9">
                <input
                  :id="'price-' + index"
                  v-model="product.price"
                  required
                  class="form-control"
                  type="number"
                  step="0.01"
                />
              </div>
            </div>

            <button
              type="button"
              class="btn btn-danger mt-2"
              @click="removeProduct(index)"
            >
              Remove Product
            </button>
          </div>

          <button
            type="button"
            class="btn btn-secondary mt-3"
            @click="addProduct"
          >
            Add Product
          </button>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submitSale">
            {{ editMode ? "Update" : "Add" }} Sale
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { useSaleStore } from "../../stores/saleStore";
import Swal from "sweetalert2";
import DatePicker from "vue3-datepicker";

const props = defineProps({
  sale: {
    type: Object,
    required: true,
    default: () => ({
      saleDate: "",
      firstName: "",
      lastName: "",
      address: "",
      saleDetails: [],
    }),
  },
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);
const saleStore = useSaleStore();

const sale = ref({
  saleDate: props.sale.saleDate || "",
  firstName: props.sale.firstName || "",
  lastName: props.sale.lastName || "",
  address: props.sale.address || "",
  saleDetails: props.sale.saleDetails || [],
});

const errorMessage = ref("");

// Add a product
const addProduct = () => {
  sale.value.saleDetails.push({
    productId: "",
    quantity: 0,
    price: 0.0,
  });
};

// Remove a product
const removeProduct = (index) => {
  sale.value.saleDetails.splice(index, 1);
};

// Submit sale form
const submitSale = async () => {
  const { saleDate, firstName, lastName, address, saleDetails } = sale.value;
  errorMessage.value = "";

  if (saleDetails.length === 0) {
    errorMessage.value = "At least one product is required.";
    return;
  }

  for (const product of saleDetails) {
    if (!product.productId || product.quantity <= 0 || product.price <= 0) {
      errorMessage.value = "Product details are required and must be valid.";
      return;
    }
  }

  try {
    if (props.editMode) {
      await saleStore.updateSale(props.sale.id, sale.value);
      Swal.fire("Success", "Sale updated successfully", "success");
    } else {
      await saleStore.createSale(sale.value);
      Swal.fire("Success", "Sale added successfully", "success");
      sale.value = {
        saleDate: "",
        firstName: "",
        lastName: "",
        address: "",
        saleDetails: [],
      };
    }
    emit("refresh");
  } catch (error) {
    errorMessage.value = "An error occurred while processing your request.";
  } finally {
    close();
  }
};

const close = () => {
  emit("close");
};

watch(
  () => props.sale,
  (newValue) => {
    sale.value = { ...newValue };
    if (!props.editMode) {
      sale.value.saleDate = "";
      sale.value.firstName = "";
      sale.value.lastName = "";
      sale.value.address = "";
      sale.value.saleDetails = [];
    }
  }
);
</script>

<style scoped>
.product-entry {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>
