<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} Inventory</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Quantity:</label>
            <input
              v-model="inventory.quantity"
              required
              type="number"
              min="0"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>Remarks:</label>
            <input v-model="inventory.remarks" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Product ID:</label>
            <input
              v-model="inventory.productId"
              required
              type="number"
              class="form-control"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitInventory"
          >
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useInventoryStore } from "../../stores/inventoryStore"; // Adjust the import based on your file structure
import Swal from "sweetalert2";

const props = defineProps({
  inventory: Object,
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);

const inventoryStore = useInventoryStore();

const submitInventory = async () => {
  if (!props.inventory.quantity || !props.inventory.productId) {
    Swal.fire("Error", "Quantity and Product ID are required", "error");
    return;
  }

  try {
    if (props.editMode) {
      await inventoryStore.updateInventory(props.inventory.id, props.inventory);
      Swal.fire("Success", "Inventory updated successfully", "success");
    } else {
      await inventoryStore.createInventory(props.inventory);
      Swal.fire("Success", "Inventory added successfully", "success");
      // Reset the inventory object for adding a new entry
      Object.assign(props.inventory, {
        quantity: "",
        remarks: "",
        productId: "",
      });
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
  () => props.inventory,
  (newValue) => {
    if (!props.editMode) {
      // Reset the form when not in edit mode
      Object.assign(props.inventory, {
        quantity: "",
        remarks: "",
        productId: "",
      });
    }
  }
);
</script>
