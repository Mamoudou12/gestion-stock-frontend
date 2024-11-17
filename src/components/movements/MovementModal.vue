<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-if="isSupplier">
            <div class="row mb-3">
              <div class="col">
                <label>Email:</label>
                <input v-model="supplier.email" class="form-control" readonly />
              </div>
              <div class="col">
                <label>Phone:</label>
                <input v-model="supplier.phone" class="form-control" readonly />
              </div>
            </div>
            <div class="mb-3">
              <label>Address:</label>
              <input v-model="supplier.address" class="form-control" readonly />
            </div>
          </div>

          <div v-else-if="isMovement">
            <div class="row mb-3">
              <div class="col">
                <label>ID:</label>
                <input v-model="movement.id" class="form-control" readonly />
              </div>
              <div class="col">
                <label>Produit:</label>
                <input
                  :value="getProductName(movement.productId)"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label>Utilisateur:</label>
                <input
                  :value="getUserName(movement.userId)"
                  class="form-control"
                  readonly
                />
              </div>

              <div class="col">
                <label>Type:</label>
                <input v-model="movement.type" class="form-control" readonly />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label>Quantité:</label>
                <input
                  v-model="movement.quantity"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col">
                <label>Entité:</label>
                <input
                  v-model="movement.entity"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Date:</label>
              <input
                :value="formatDate(movement.movementDate)"
                class="form-control"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { useProductStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";

const props = defineProps({
  supplier: {
    type: Object,
    default: null,
  },
  movement: {
    type: Object,
    default: null,
  },
  modalTitle: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const productStore = useProductStore(); 
const userStore = useUserStore(); 

const close = () => {
  emit("close");
};

const isSupplier = computed(() => props.supplier !== null);
const isMovement = computed(() => props.movement !== null);

const getProductName = (productId) => {
  const product = productStore.products.find(
    (product) => product.id === productId
  );
  return product ? product.name : "Produit inconnu"; 
};

const getUserName = (userId) => {
  const user = userStore.users.find((user) => user.id === userId);
  return user ? user.name : "Utilisateur inconnu";
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR"); 
};
</script>

<style scoped>
label {
  color: black;
  font-size: 18px;
}

h5 {
  color: black;
}

</style>
