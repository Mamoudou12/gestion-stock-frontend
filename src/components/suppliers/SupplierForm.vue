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
            <div v-if="errors.email" class="text-danger">
              {{ errors.email }}
            </div>
          </div>
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
            <div v-if="errors.phone" class="text-danger">
              {{ errors.phone }}
            </div>
          </div>
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

const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  supplier: Object,
  editMode: Boolean,
  displayMode: String,
});

const emit = defineEmits(["close", "refresh"]);
const supplierStore = useSupplierStore();

// Gestion des erreurs
const errors = ref({
  email: "",
  phone: "",
  address: "",
});

const validateField = (field) => {
  if (field === "email") {
    errors.value.email =
      props.supplier.email && props.supplier.email.includes("@")
        ? ""
        : t("invalidEmail");
  }
  if (field === "phone") {
    errors.value.phone =
      props.supplier.phone && props.supplier.phone.length >= 8
        ? ""
        : t("invalidPhone");
  }
  if (field === "address") {
    errors.value.address = props.supplier.address ? "" : t("addressRequired");
  }
};

const submitSupplier = async () => {
  // Validation du formulaire complet
  validateField("email");
  validateField("phone");
  validateField("address");

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
      Object.assign(props.supplier, { email: "", phone: "", address: "" });
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during add/update:", error);
    toast.error(error.response?.data?.message || t("error"));
  } finally {
    close();
  }
};

const close = () => {
  emit("close");
};

watch(
  () => props.supplier,
  (newValue) => {
    if (!props.editMode) {
      Object.assign(props.supplier, { email: "", phone: "", address: "" });
    }
  }
);
</script>
