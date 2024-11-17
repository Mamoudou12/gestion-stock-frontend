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
            <input
              v-model="user.name"
              :disabled="previewMode"
              required
              class="form-control"
            />
            <small class="text-danger">{{ errors.name }}</small>
          </div>

          <div class="mb-3">
            <label>Email:</label>
            <input
              v-model="user.email"
              :disabled="previewMode"
              required
              type="email"
              class="form-control"
            />
            <small class="text-danger">{{ errors.email }}</small>
          </div>

          <div class="mb-3">
            <label>Password:</label>
            <div class="input-group">
              <input
                v-model="user.password"
                :type="showPassword ? 'text' : 'password'"
                :disabled="previewMode || editMode"
                required
                class="form-control"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="togglePassword"
                :disabled="previewMode || editMode"
              >
                <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
              </button>
            </div>
            <small class="text-danger">{{ errors.password }}</small>
          </div>

          <div class="mb-3">
            <label>Role:</label>
            <select
              v-model="user.role"
              :disabled="previewMode"
              required
              class="form-select"
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            <small class="text-danger">{{ errors.role }}</small>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitUser"
            :disabled="previewMode"
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
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useUserStore } from "../../stores/userStore";

const toast = useToast();

const props = defineProps({
  editMode: Boolean,
  user: Object,
  previewMode: Boolean,
});

const emit = defineEmits(["close", "refresh"]);
const userStore = useUserStore();

const errors = ref({}); // Initialiser les erreurs comme un objet vide
const serverErrors = ref([]); // Pour stocker temporairement les erreurs serveur
const showPassword = ref(false); // Pour gérer la visibilité du mot de passe

// Fonction pour basculer la visibilité du mot de passe
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Mapper les erreurs du serveur vers les champs individuels
watch(serverErrors, (newErrors) => {
  errors.value = {}; // Réinitialiser les erreurs
  newErrors.forEach((err) => {
    if (err.path === "name") errors.value.name = err.msg;
    if (err.path === "email") errors.value.email = err.msg;
    if (err.path === "password") errors.value.password = err.msg;
    if (err.path === "role") errors.value.role = err.msg;
  });
});

// Soumettre un utilisateur (créer ou mettre à jour)
const submitUser = async () => {
  serverErrors.value = []; // Réinitialiser les erreurs serveur

  try {
    if (props.editMode) {
      await userStore.updateUser(props.user.id, props.user);
      Swal.fire("Success", "User updated successfully", "success");
    } else {
      await userStore.createUser(props.user);
      Swal.fire("Success", "User added successfully", "success");
    }

    close();
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

// Fermer le modal
const close = () => {
  emit("close");
};
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>
