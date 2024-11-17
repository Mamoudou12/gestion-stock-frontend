<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? $t("editSupplier") : $t("addSupplier") }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <!-- Email Field -->
          <div class="mb-3">
            <label>{{ $t("email") }}:</label>
            <input
              v-model="supplier.email"
              required
              class="form-control"
              :readonly="displayMode === 'view'"
              @input="validateField('email')"
              :placeholder="$t('enterEmail')"
            />
            <small class="text-danger">{{ errors.email }}</small>
          </div>

          <!-- Phone Field -->
          <div class="mb-3">
            <label>{{ $t("phone") }}:</label>
            <input
              v-model="supplier.phone"
              required
              class="form-control"
              :readonly="displayMode === 'view'"
              @input="validateField('phone')"
              :placeholder="$t('enterPhone')"
            />
            <small class="text-danger">{{ errors.phone }}</small>
          </div>

          <!-- Address Field -->
          <div class="mb-3">
            <label>{{ $t("address") }}:</label>
            <input
              v-model="supplier.address"
              required
              class="form-control"
              :readonly="displayMode === 'view'"
              @input="validateField('address')"
              :placeholder="$t('enterAddress')"
            />
            <div v-if="errors.address" class="text-danger">
              {{ errors.address }}
            </div>
          </div>

          <!-- Global Server Errors -->
          <div v-if="serverErrors.length > 0" class="alert alert-danger">
            <ul>
              <li v-for="error in serverErrors" :key="error.msg">
                {{ error.msg }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            {{ $t("close") }}
          </button>
          <button
            v-if="displayMode !== 'view'"
            type="button"
            class="btn btn-primary"
            @click="submitSupplier"
          >
            {{ editMode ? $t("update") : $t("add") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useSupplierStore } from "../../stores/supplierStore";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

// i18n and Toast
const { t } = useI18n();
const toast = useToast();

// Props and Emits
const props = defineProps({
  supplier: Object,
  editMode: Boolean,
  displayMode: String,
});
const emit = defineEmits(["close", "refresh"]);

// Supplier Store
const supplierStore = useSupplierStore();

// Error Management
const errors = ref({});

const serverErrors = ref([]); // Pour stocker temporairement les erreurs serveur

// Surveiller les erreurs serveur pour les remonter dans `errors`
watch(serverErrors, (newErrors) => {
  errors.value = {}; // Réinitialiser les erreurs
  newErrors.forEach((err) => {
    if (err.path === "email") {
      errors.value.email = err.msg;
    }
    if (err.path === "phone") {
      errors.value.phone = err.msg;
    }
    if (err.path === "address") {
      errors.value.address = err.msg;
    }
  });
});

const submitSupplier = async () => {
  serverErrors.value = []; // Réinitialiser les erreurs serveur

  if (errors.value.email || errors.value.phone || errors.value.address) {
    toast.error(t("fixErrors"));
    return;
  }

  try {
    if (props.editMode) {
      await supplierStore.updateSupplier(props.supplier.id, props.supplier);
      toast.success(t("successUpdate"));
    } else {
      await supplierStore.createSupplier(props.supplier);
      toast.success(t("successAdd"));
      // Reset form fields
      Object.assign(props.supplier, { email: "", phone: "", address: "" });
    }
    emit("refresh");
  } catch (error) {
    if (error.response && error.response.data.errors) {
      // Remplir les erreurs serveur
      serverErrors.value = error.response.data.errors;
    } else {
      toast.error("An error occurred while processing your request");
    }
  }
};

// Close Modal
const close = () => {
  emit("close");
};

// Reset form when supplier changes
watch(
  () => props.supplier,
  () => {
    if (!props.editMode) {
      Object.assign(props.supplier, { email: "", phone: "", address: "" });
    }
  }
);
</script>
