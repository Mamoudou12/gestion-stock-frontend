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
            <label for="sale_Date" class="col-sm-2 col-form-label">
              {{ $t("sale_date") }}:
            </label>
            <div class="col-sm-10">
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
            <label for="firstName" class="col-sm-2 col-form-label">
              {{ $t("first_name") }}:
            </label>
            <div class="col-sm-10">
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
            <label for="lastName" class="col-sm-2 col-form-label">
              {{ $t("last_name") }}:
            </label>
            <div class="col-sm-10">
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
            <label for="address" class="col-sm-2 col-form-label">
              {{ $t("address") }}:
            </label>
            <div class="col-sm-10">
              <input
                id="address"
                v-model="sale.address"
                required
                class="form-control"
                type="text"
              />
            </div>
          </div>

          <div
            v-for="(product, index) in sale.saleDetails"
            :key="index"
            class="product-entry mb-3"
          >
            <h6>{{ $t("product") }} {{ index + 1 }}</h6>

            <div class="row">
              <div class="col-md-4">
                <label :for="'productId-' + index">{{ $t("product") }}:</label>
                <select
                  :id="'productId-' + index"
                  v-model="product.productId"
                  required
                  class="form-control"
                  @change="updateProductPrice(product)"
                >
                  <option value="" disabled>{{ $t("selectProduct") }}</option>
                  <option
                    v-for="prod in products"
                    :key="prod.id"
                    :value="prod.id"
                  >
                    {{ prod.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label :for="'quantity-' + index" class="form-label">
                  {{ $t("quantity") }}:
                </label>
                <input
                  :id="'quantity-' + index"
                  v-model="product.quantity"
                  required
                  class="form-control"
                  type="number"
                />
              </div>
              <div class="col-md-4">
                <label :for="'price-' + index" class="form-label">
                  {{ $t("price") }}:
                </label>
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
              {{ $t("removeProduct") }}
            </button>
          </div>

          <button
            type="button"
            class="btn btn-secondary mt-3"
            @click="addProduct"
          >
            {{ $t("addProduct") }}
          </button>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            {{ $t("close") }}
          </button>
          <button type="button" class="btn btn-primary" @click="submitSale">
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
import Swal from "sweetalert2";
import DatePicker from "vue3-datepicker";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emit = defineEmits(["close", "refresh"]);
const saleStore = useSaleStore();
const productStore = useProductStore();

const products = computed(() => productStore.products);

const sale = ref({
  saleDate: "",
  firstName: "",
  lastName: "",
  address: "",
  saleDetails: [],
});

const errorMessage = ref("");

const addProduct = () => {
  sale.value.saleDetails.push({
    productId: "",
    quantity: 0,
    price: 0.0,
  });
};


const removeProduct = (index) => {
  sale.value.saleDetails.splice(index, 1);
};

const updateProductPrice = (product) => {
  const selectedProduct = products.value.find(
    (prod) => prod.id === product.productId
  );
  product.price = selectedProduct ? selectedProduct.sale_price : 0;
};

const submitSale = async () => {
  const { saleDate, firstName, lastName, address, saleDetails } = sale.value;
  errorMessage.value = "";

  if (saleDetails.length === 0) {
    errorMessage.value = $t("atLeastOneProductRequired");
    return;
  }

  for (const product of saleDetails) {
    if (!product.productId || product.quantity <= 0 || product.price <= 0) {
      errorMessage.value = t("validProductDetailsRequired");
      return;
    }
  }

  try {
    await saleStore.createSale(sale.value);
    Swal.fire(t("success"), t("saleAddedSuccessfully"), "success");
    emit("refresh");
    emit("close");
  } catch (error) {
    errorMessage.value = t("errorSavingSale");
    console.error(error);
  }
};

// Fonction pour fermer le modal
const close = () => {
  emit("close");
};
</script>
