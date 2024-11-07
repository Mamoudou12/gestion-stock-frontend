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
            />
          </div>
          <div class="mb-3">
            <label>{{ $t("phone") }}:</label>
            <input
              v-model="supplier.phone"
              required
              class="form-control"
              :readonly="displayMode === 'view'"
            />
          </div>
          <div class="mb-3">
            <label>{{ $t("address") }}:</label>
            <input
              v-model="supplier.address"
              required
              class="form-control"
              :readonly="displayMode === 'view'"
            />
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
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  supplier: Object,
  editMode: Boolean,
  displayMode: String,
});

const emit = defineEmits(["close", "refresh"]);

const supplierStore = useSupplierStore();

const submitSupplier = async () => {
  if (
    !props.supplier.email ||
    !props.supplier.phone ||
    !props.supplier.address
  ) {
    Swal.fire(t("error"), t("allFieldsRequired"), "error");
    return;
  }

  try {
    if (props.editMode) {
      await supplierStore.updateSupplier(props.supplier.id, props.supplier);
      Swal.fire(t("success"), t("successUpdate"), "success");
    } else {
      await supplierStore.createSupplier(props.supplier);
      Swal.fire(t("success"), t("successAdd"), "success");
      props.supplier = { email: "", phone: "", address: "" };
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during add/update:", error);
    Swal.fire(t("error"), error.response?.data?.message || t("error"), "error");
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
