<template>
  <div class="modal" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editMode ? $t("editUser") : $t("addUser") }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>{{ $t("name") }}:</label>
            <input v-model="user.name" required class="form-control" />
          </div>
          <div class="mb-3">
            <label>{{ $t("email") }}:</label>
            <input
              v-model="user.email"
              required
              type="email"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label>{{ $t("password") }}:</label>
            <input
              v-model="user.password"
              :required="!editMode"
              type="password"
              class="form-control"
            />
            <small v-if="editMode" class="form-text text-muted">
              {{ $t("leaveBlankToKeepPassword") }}
            </small>
          </div>
          <div class="mb-3">
            <label>{{ $t("role") }}:</label>
            <select v-model="user.role" required class="form-select">
              <option value="">{{ $t("selectRole") }}</option>
              <option value="ADMIN">{{ $t("admin") }}</option>
              <option value="EMPLOYE">{{ $t("employee") }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            {{ $t("close") }}
          </button>
          <button type="button" class="btn btn-primary" @click="submitUser">
            {{ editMode ? $t("update") : $t("add") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "../../stores/userStore";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
    !props.user.role ||
    (!props.editMode && !props.user.password)
  ) {
    Swal.fire(t("error"), t("allFieldsRequired"), "error");
    return;
  }

  try {
    if (props.editMode) {
      const userData = { ...props.user };
      if (!userData.password) delete userData.password;

      await userStore.updateUser(props.user.id, userData);
      Swal.fire(t("success"), t("userUpdatedSuccessfully"), "success");
    } else {
      await userStore.createUser(props.user);
      Swal.fire(t("success"), t("userAddedSuccessfully"), "success");
      props.user = { name: "", email: "", password: "", role: "" };
    }
    emit("refresh");
  } catch (error) {
    console.error("Error during add/update:", error);
    Swal.fire(
      t("error"),
      error.response?.data?.message || t("anErrorOccurred"),
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
