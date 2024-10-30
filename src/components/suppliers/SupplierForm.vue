<!-- SupplierForm.vue -->
<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Supplier</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Email:</label>
            <input v-model="supplier.email" required class="form-control" />
          </div>
          <div class="mb-3">
            <label>Phone:</label>
            <input v-model="supplier.phone" required class="form-control" />
          </div>
          <div class="mb-3">
            <label>Address:</label>
            <input v-model="supplier.address" required class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submitSupplier">
            {{ editMode ? "Update" : "Add" }}
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

const props = defineProps({
  supplier: Object,
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);

const supplierStore = useSupplierStore();

const submitSupplier = async () => {
  if (
    !props.supplier.email ||
    !props.supplier.phone ||
    !props.supplier.address
  ) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  try {
    if (props.editMode) {
      await supplierStore.updateSupplier(props.supplier.id, props.supplier);
      Swal.fire("Success", "Supplier updated successfully", "success");
    } else {
      await supplierStore.createSupplier(props.supplier);
      Swal.fire("Success", "Supplier added successfully", "success");
      props.supplier = { email: "", phone: "", address: "" };
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during add/update:", error);
    Swal.fire(
      "Error",
      error.response?.data?.message || "An error occurred",
      "error"
    );
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
      // Reset the form when not in edit mode
      Object.assign(props.supplier, { email: "", phone: "", address: "" });
    }
  }
);
</script>
