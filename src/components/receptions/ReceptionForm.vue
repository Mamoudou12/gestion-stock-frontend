<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? $t("editReception") : $t("addReception") }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label for="supplierId">{{ $t("supplier") }}:</label>
            <select
              id="supplierId"
              v-model="reception.supplierId"
              required
              class="form-control"
            >
              <option value="" disabled>{{ $t("selectSupplier") }}</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.email }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="receptionDate">{{ $t("receptionDate") }}:</label>
            <Datepicker
              v-model="reception.receptionDate"
              format="yyyy-MM-dd"
              class="form-control custom-datepicker"
            />
          </div>

          <div
            v-for="(product, index) in reception.detailReceptions"
            :key="index"
            class="product-entry"
          >
            <h6>{{ $t("product") }} {{ index + 1 }}</h6>
            <div class="row">
              <div class="col-md-4 mb-2">
                <label :for="'productId-' + index">{{ $t("product") }}:</label>
                <select
                  :id="'productId-' + index"
                  v-model="product.productId"
                  required
                  class="form-control"
                >
                  <option value="" disabled>{{ $t("selectSupplier") }}</option>
                  <option
                    v-for="prod in products"
                    :key="prod.id"
                    :value="prod.id"
                  >
                    {{ prod.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4 mb-2">
                <label :for="'quantity-' + index">{{ $t("quantity") }}:</label>
                <input
                  :id="'quantity-' + index"
                  v-model="product.quantity"
                  required
                  class="form-control"
                  type="number"
                />
              </div>
              <div class="col-md-4 mb-2">
                <label :for="'price-' + index">{{ $t("price") }}:</label>
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
          <button
            type="button"
            class="btn btn-primary"
            @click="submitReception"
          >
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
import Swal from "sweetalert2";
import Datepicker from "vue3-datepicker";
import { useI18n } from "vue-i18n"; // Importer useI18n pour les traductions

const { t } = useI18n();

const props = defineProps({
  reception: {
    type: Object,
    required: true,
    default: () => ({
      supplierId: "",
      receptionDate: new Date(),
      detailReceptions: [],
    }),
  },
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);
const receptionStore = useReceptionStore();
const supplierStore = useSupplierStore();
const productStore = useProductStore();

const suppliers = computed(() => supplierStore.suppliers);
const products = computed(() => productStore.products);

const reception = ref({
  supplierId: props.reception.supplierId || "",
  receptionDate: props.reception.receptionDate || new Date(),
  detailReceptions: props.reception.detailReceptions || [],
});

const addProduct = () => {
  reception.value.detailReceptions.push({
    productId: "",
    quantity: 0,
    price: 0.0,
  });
};

const removeProduct = (index) => {
  reception.value.detailReceptions.splice(index, 1);
};

const submitReception = async () => {
  const { supplierId, receptionDate, detailReceptions } = reception.value;

  if (!supplierId || detailReceptions.length === 0) {
    Swal.fire(t("error"), t("errorMessage"), "error");
    return;
  }

  try {
    if (props.editMode) {
      await receptionStore.updateReception(props.reception.id, reception.value);
      Swal.fire(t("success"), t("receptionUpdated"), "success");
    } else {
      await receptionStore.createReception(reception.value);
      Swal.fire(t("success"), t("receptionAdded"), "success");
      reception.value.supplierId = "";
      reception.value.receptionDate = new Date();
      reception.value.detailReceptions = [];
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during reception add/update:", error);
    Swal.fire(
      t("error"),
      error.response?.data?.message || t("unknownError"),
      "error"
    );
  } finally {
    close();
  }
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
.product-entry {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
</style>
