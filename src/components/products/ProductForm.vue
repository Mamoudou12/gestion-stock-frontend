<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Product</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Name:</label>
              <input v-model="product.name" :disabled="previewMode" required class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label>Stock:</label>
              <input
                type="number"
                v-model="product.stock"
                :disabled="previewMode"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Purshase Price:</label>
              <input
                type="number"
                v-model="product.purshase_price"
                :disabled="previewMode"
                required
                class="form-control"
                step="0.01"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label>Sale Price:</label>
              <input
                type="number"
                v-model="product.sale_price"
                :disabled="previewMode"
                required
                class="form-control"
                step="0.01"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label>Safety Stock:</label>
              <input
                type="number"
                v-model="product.safetyStock"
                :disabled="previewMode"
                required
                class="form-control"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label>Barcode:</label>
              <input
                type="text"
                v-model="product.barcode"
                :disabled="previewMode"
                required
                class="form-control"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submitProduct" :disabled="previewMode">
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";
import Swal from "sweetalert2";
import { useProductStore } from "../../stores/productStore";

// Définir les props
const props = defineProps({
  editMode: Boolean,
  product: Object,
  previewMode: Boolean, // Nouvelle prop pour le mode aperçu
});

// Définir l'emit pour émettre des événements vers le parent
const emit = defineEmits(["close", "refresh"]);

// Extraire le produit depuis les props avec "toRefs"
const { product: currentProduct } = toRefs(props);

// Accéder au store des produits
const productStore = useProductStore();

// Fonction pour soumettre le formulaire (ajout ou mise à jour)
const submitProduct = async () => {
  const { name, stock, purshase_price, sale_price, safetyStock, barcode } =
    currentProduct.value;

  // Validation simple des champs
  if (
    !name ||
    stock <= 0 ||
    purshase_price <= 0 ||
    sale_price <= 0 ||
    safetyStock <= 0 ||
    !barcode
  ) {
    return Swal.fire(
      "Error",
      "All fields are required and must be valid",
      "error"
    );
  }

  try {
    if (props.editMode) {
      // Mise à jour d'un produit existant
      await productStore.updateProduct(currentProduct.value.id, currentProduct.value);
      Swal.fire("Success", "Product updated successfully", "success");
    } else {
      // Ajout d'un nouveau produit
      await productStore.createProduct(currentProduct.value);
      Swal.fire("Success", "Product added successfully", "success");
    }

    // Fermer la modal et rafraîchir la liste des produits
    close();
    emit("refresh");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "An error occurred", "error");
  }
};

// Fonction pour fermer la modal
const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
}
</style>
