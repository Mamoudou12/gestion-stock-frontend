<template>
  <div class="modal show d-block">
    <div class="modal-dialog modal-lg custom-modal-width">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? $t("editReception") : $t("addReception") }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <!-- Sélection du fournisseur -->
          <div class="mb-3">
            <label for="supplierId">{{ $t("supplier") }}:</label>
            <select
              id="supplierId"
              v-model="reception.supplierId"
              required
              class="form-control form-control-sm w-100"
            >
              <option value="" disabled>{{ $t("selectSupplier") }}</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }}
              </option>
            </select>
            <small v-if="errors.supplierId" class="text-danger">
              {{ errors.supplierId }}
            </small>
          </div>

          <!-- Date de réception avec champ de date HTML -->
          <div class="mb-3">
            <label for="receptionDate">{{ $t("receptionDate") }}:</label>
            <input
              type="date"
              id="receptionDate"
              v-model="reception.receptionDate"
              :max="maxDate"
              class="form-control form-control-sm w-100"
              required
            />
            <small v-if="!reception.receptionDate" class="text-danger">
              {{ $t("selectDateError") }}
            </small>
          </div>

          <!-- Détails des produits -->
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in reception.detailReceptions" :key="index">
                <td>
                  <select
                    class="form-control form-control-sm w-100"
                    v-model="product.productId"
                    @change="updateProductPrice(product)"
                  >
                    <option value="" disabled>{{ $t("selectProduct") }}</option>
                    <option v-for="prod in products" :key="prod.id" :value="prod.id">
                      {{ prod.name }}
                    </option>
                  </select>
                  <small
                    v-if="
                      errors[`detailReceptions.${index}.productId`] ||
                      product.productId === ''
                    "
                    class="text-danger"
                  >
                    {{
                      errors[`detailReceptions.${index}.productId`] ||
                      $t("selectProductError")
                    }}
                  </small>
                </td>
                <td>
                  <input
                    type="number"
                    v-model="product.quantity"
                    class="form-control form-control-sm w-100"
                    placeholder="Quantity"
                    required
                    min="1"
                  />
                  <small v-if="product.quantity <= 0" class="text-danger">{{
                    $t("quantityGreaterThanZero")
                  }}</small>
                  <small
                    v-if="errors[`detailReceptions.${index}.quantity`]"
                    class="text-danger"
                  >
                    {{ errors[`detailReceptions.${index}.quantity`] }}
                  </small>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    v-model="product.price"
                    class="form-control form-control-sm w-100"
                    placeholder="Price"
                    required
                    min="0.01"
                  />
                  <small v-if="product.price <= 0" class="text-danger">{{
                    $t("priceGreaterThanZero")
                  }}</small>
                  <small
                    v-if="errors[`detailReceptions.${index}.price`]"
                    class="text-danger"
                  >
                    {{ errors[`detailReceptions.${index}.price`] }}
                  </small>
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
          <button type="button" class="btn btn-success btn-sm mt-3" @click="addProduct">
            {{ $t("addProduct") }}
          </button>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" @click="close">
            {{ $t("close") }}
          </button>
          <button type="button" class="btn btn-primary btn-sm" @click="submitReception">
            {{ editMode ? $t("updateReception") : $t("addReceptionButton") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import { useReceptionStore } from "../../stores/receptionStore";
import { useSupplierStore } from "../../stores/supplierStore";
import { useProductStore } from "../../stores/productStore";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  reception: {
    type: Object,
    required: true,
    default: () => ({
      supplierId: "",
      receptionDate: new Date().toISOString().split("T")[0],
      detailReceptions: [],
    }),
  },
  editMode: Boolean,
});

const maxDate = new Date().toISOString().split("T")[0];

const emit = defineEmits(["close", "refresh"]);
const receptionStore = useReceptionStore();
const supplierStore = useSupplierStore();
const productStore = useProductStore();

const suppliers = computed(() => supplierStore.suppliers);
const products = computed(() => productStore.products);

const reception = ref({
  supplierId: props.reception.supplierId || "",
  receptionDate: props.reception.receptionDate || new Date().toISOString().split("T")[0],
  detailReceptions: props.reception.detailReceptions || [],
});

const errors = ref({});

const addProduct = () => {
  reception.value.detailReceptions.push({
    productId: "",
    quantity: 1,
    price: 0.01,
  });
};

// Function to update the price when a product is selected
const updateProductPrice = (product) => {
  const selectedProduct = products.value.find((prod) => prod.id === product.productId);
  product.price = selectedProduct ? selectedProduct.purshase_price : 0;
};

const removeProduct = (index) => {
  reception.value.detailReceptions.splice(index, 1);
};

const submitReception = async () => {
  const { supplierId, receptionDate, detailReceptions } = reception.value;

  if (
    !supplierId ||
    !receptionDate ||
    detailReceptions.length === 0 ||
    detailReceptions.some((p) => p.quantity <= 0 || p.price <= 0)
  ) {
    if (!supplierId) errors.value.supplierId = t("supplierRequired");
    if (!receptionDate) errors.value.receptionDate = t("dateRequired");
    toast.error(t("errorMessage"));
    return;
  }

  try {
    if (props.editMode) {
      await receptionStore.updateReception(props.reception.id, reception.value);
      toast.success(t("receptionUpdated"));
    } else {
      await receptionStore.createReception(reception.value);
      toast.success(t("receptionAdded"));
      reception.value.supplierId = "";
      reception.value.receptionDate = new Date().toISOString().split("T")[0];
      reception.value.detailReceptions = [];
    }
    emit("refresh");
  } catch (error) {
    errors.value = error.response?.data?.errors || {};
    toast.error(error.response?.data?.message || t("unknownError"));
  } finally {
    close();
  }
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
.custom-modal-width {
  max-width: 70%;
}

.form-control,
.btn {
  height: 36px;
}
</style>
