<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ editMode ? "Edit" : "Add" }} User</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>Name:</label>
            <input v-model="user.name" required class="form-control" />
          </div>
          <div class="mb-3">
            <label>Email:</label>
            <input
              v-model="user.email"
              required
              type="email"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>Password:</label>
            <input
              v-model="user.password"
              required
              v-if="!editMode"
              type="password"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>Role:</label>
            <select v-model="user.role" required class="form-select">
              <option value="">Select role</option>
              <option value="ADMIN">admin</option>
              <option value="EMPLOYE">employe</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submitUser">
            {{ editMode ? "Update" : "Add" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../../stores/userStore"; // Ensure you have this store set up
import Swal from "sweetalert2";

const props = defineProps({
  user: Object,
  editMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);

const userStore = useUserStore();

const submitUser = async () => {
  if (
    !props.user.name ||
    !props.user.email ||
    (props.editMode ? false : !props.user.password) || // Password required only when adding a user
    !props.user.role  
  ) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  try {
    if (props.editMode) {
      await userStore.updateUser(props.user.id, props.user);
      Swal.fire("Success", "User updated successfully", "success");
    } else {
      await userStore.createUser(props.user);
      Swal.fire("Success", "User added successfully", "success");
      props.user = { name: "", email: "", password: "", role: "" }; // Reset form for new user
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

// Reset form when switching between edit and add mode
watch(
  () => props.user,
  (newValue) => {
    if (!props.editMode) {
      // Reset the form when not in edit mode
      Object.assign(props.user, {
        name: "",
        email: "",
        password: "",
        role: "",
      });
    }
  }
);
</script>

<style scoped>
/* Add any additional styles here */
</style>
