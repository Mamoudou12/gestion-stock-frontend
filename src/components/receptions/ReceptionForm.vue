<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Reception</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <!-- Champ de sélection des fournisseurs -->
          <div class="mb-3">
            <label for="supplierId">Supplier:</label>
            <select
              id="supplierId"
              v-model="reception.supplierId"
              required
              class="form-control"
            >
              <option value="" disabled>Select a supplier</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.email }}
              </option>
            </select>
          </div>

          <!-- Champ de sélection de date -->
          <div class="mb-3">
            <label for="receptionDate">Reception Date:</label>
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
            <h6>Product {{ index + 1 }}</h6>

            <div class="mb-2">
              <label :for="'productId-' + index">Product:</label>
              <select
                :id="'productId-' + index"
                v-model="product.productId"
                required
                class="form-control"
              >
                <option value="" disabled>Select a product</option>
                <option
                  v-for="prod in products"
                  :key="prod.id"
                  :value="prod.id"
                >
                  {{ prod.name }}
                  <!-- Afficher le nom du produit -->
                </option>
              </select>
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
import { ref, watch, defineProps, defineEmits, computed } from "vue";
import { useReceptionStore } from "../../stores/receptionStore";
import { useSupplierStore } from "../../stores/supplierStore"; // Importer le store des fournisseurs
import { useProductStore } from "../../stores/productStore"; // Importer le store des produits
import Swal from "sweetalert2";
import Datepicker from "vue3-datepicker"; // Importer vue3-datepicker

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
const supplierStore = useSupplierStore(); // Utiliser le store des fournisseurs
const productStore = useProductStore(); // Utiliser le store des produits

// Récupérer la liste des fournisseurs
const suppliers = computed(() => supplierStore.suppliers);

// Récupérer la liste des produits
const products = computed(() => productStore.products); // Assurez-vous que ce store existe

// Initialisation des champs
const reception = ref({
  supplierId: props.reception.supplierId || "",
  receptionDate: props.reception.receptionDate || new Date(),
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
  const { supplierId, receptionDate, detailReceptions } = reception.value;

  if (!supplierId || detailReceptions.length === 0) {
    Swal.fire(
      "Error",
      "Supplier ID, Reception Date, and at least one product are required",
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
      reception.value.receptionDate = new Date();
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
      reception.value.receptionDate = new Date();
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

.custom-datepicker {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
}
</style>
