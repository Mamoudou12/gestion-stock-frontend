<template>
  <div class="modal show d-block" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("add_sale") }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <div class="mb-3 row">
            <!-- Date and First Name on the same line -->
            <div class="col-sm-6">
              <label for="sale_Date" class="col-form-label">
                {{ $t("sale_date") }}:
              </label>
              <div class="input-group">
                <DatePicker
                  v-model="sale.saleDate"
                  :format="'YYYY-MM-DD'"
                  class="form-control form-control-sm"
                />
                <span class="input-group-text">
                  <i class="fas fa-calendar-alt"></i>
                </span>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="firstName" class="col-form-label">
                {{ $t("first_name") }}:
              </label>
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
              <label for="address" class="col-form-label">
                {{ $t("address") }}:
              </label>
              <input
                id="address"
                v-model="sale.address"
                class="form-control"
                type="text"
                placeholder="Enter Address"
              />
            </div>
            <div class="col-sm-6">
              <label for="lastName" class="col-form-label">
                {{ $t("last_name") }}:
              </label>
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
                  <th>{{ $t("product") }}</th>
                  <th>{{ $t("quantity") }}</th>
                  <th>{{ $t("price") }}</th>
                  <th>{{ $t("action") }}</th>
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
                      <option value="" disabled>
                        {{ $t("selectProduct") }}
                      </option>
                      <option
                        v-for="prod in products"
                        :key="prod.id"
                        :value="prod.id"
                      >
                        {{ prod.name }}
                      </option>
                    </select>
                    <small v-if="!product.productId" class="text-danger">
                      {{ $t("selectProductError") }}
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
                    <small v-if="product.quantity <= 0" class="text-danger">
                      {{ $t("validQuantityRequired") }}
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
                      {{ $t("removeProduct") }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            class="btn btn-success btn-sm"
            @click="addProduct"
          >
            {{ $t("addProduct") }}
          </button>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" @click="close">
            {{ $t("close") }}
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="submitSale"
          >
            {{ $t("addSale") }}
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
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import DatePicker from "vue3-datepicker";

const { t } = useI18n();
const toast = useToast();

const emit = defineEmits(["close", "refresh"]);
const saleStore = useSaleStore();
const productStore = useProductStore();

const products = computed(() => productStore.products);

const sale = ref({
  saleDate: new Date(),
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: [],
});

const errorMessage = ref("");

// Function to add a product to the sale
const addProduct = () => {
  sale.value.saleDetails.push({
    productId: "",
    quantity: 1,
    price: 0.0,
  });
};

// Function to remove a product from the sale
const removeProduct = (index) => {
  sale.value.saleDetails.splice(index, 1);
};

// Function to update the price when a product is selected
const updateProductPrice = (product) => {
  const selectedProduct = products.value.find(
    (prod) => prod.id === product.productId
  );
  product.price = selectedProduct ? selectedProduct.sale_price : 0;
};

// Function to submit the sale
const submitSale = async () => {
  const { saleDate, firstName, lastName, address, saleDetails } = sale.value;
  errorMessage.value = "";

  if (saleDetails.length === 0) {
    toast.error(t("atLeastOneProductRequired"));
    return;
  }

  // Validate saleDetails to ensure all fields are properly filled
  for (const product of saleDetails) {
    if (!product.productId || product.quantity <= 0 || product.price <= 0) {
      toast.error(t("validProductDetailsRequired"));
      return;
    }
  }

  try {
    await saleStore.createSale(sale.value);
    toast.success(t("saleAddedSuccessfully"));
    emit("refresh");
    emit("close");
  } catch (error) {
    toast.error(t("errorSavingSale"));
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
