<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Reception</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label for="supplierId">Supplier ID:</label>
            <input
              id="supplierId"
              v-model="reception.supplierId"
              required
              class="form-control"
              type="number"
            />
          </div>

          <div
            v-for="(product, index) in reception.detailReceptions"
            :key="index"
            class="product-entry"
          >
            <h6>Product {{ index + 1 }}</h6>

            <div class="mb-2">
              <label :for="'productId-' + index">Product ID:</label>
              <input
                :id="'productId-' + index"
                v-model="product.productId"
                required
                class="form-control"
                type="number"
              />
            </div>

            <div class="mb-2">
              <label :for="'quantity-' + index">Quantity:</label>
              <input
                :id="'quantity-' + index"
                v-model="product.quantity"
                required
                class="form-control"
                type="number"
              />
            </div>

            <div class="mb-2">
              <label :for="'price-' + index">Price:</label>
              <input
                :id="'price-' + index"
                v-model="product.price"
                required
                class="form-control"
                type="number"
                step="0.01"
              />
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
          <button
            type="button"
            class="btn btn-primary"
            @click="submitReception"
          >
            {{ editMode ? "Update" : "Add" }} Reception
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { useReceptionStore } from "../../stores/receptionStore";
import Swal from "sweetalert2";

const props = defineProps({
  reception: {
    type: Object,
    required: true,
    default: () => ({
      supplierId: "",
      detailReceptions: [],
    }),
  },
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);
const receptionStore = useReceptionStore();

// Initialisation des champs
const reception = ref({
  supplierId: props.reception.supplierId || "",
  detailReceptions: props.reception.detailReceptions || [],
});

// Ajouter un produit à la liste
const addProduct = () => {
  reception.value.detailReceptions.push({
    productId: "",
    quantity: 0,
    price: 0.0,
  });
};

// Supprimer un produit spécifique
const removeProduct = (index) => {
  reception.value.detailReceptions.splice(index, 1);
};

// Valider et soumettre le formulaire
const submitReception = async () => {
  const { supplierId, detailReceptions } = reception.value;

  if (!supplierId || detailReceptions.length === 0) {
    Swal.fire(
      "Error",
      "Supplier ID and at least one product are required",
      "error"
    );
    return;
  }

  try {
    if (props.editMode) {
      await receptionStore.updateReception(props.reception.id, reception.value);
      Swal.fire("Success", "Reception updated successfully", "success");
    } else {
      await receptionStore.createReception(reception.value);
      Swal.fire("Success", "Reception added successfully", "success");
      // Réinitialiser les valeurs si en mode ajout
      reception.value.supplierId = "";
      reception.value.detailReceptions = [];
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during reception add/update:", error);
    Swal.fire(
      "Error",
      error.response?.data?.message || "An error occurred",
      "error"
    );
  } finally {
    close();
  }
};

// Fermer le modal
const close = () => {
  emit("close");
};

// Surveiller les changements de réception
watch(
  () => props.reception,
  (newValue) => {
    reception.value = { ...newValue };
    if (!props.editMode) {
      reception.value.supplierId = "";
      reception.value.detailReceptions = [];
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
