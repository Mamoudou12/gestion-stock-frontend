<template>
  <div>
    <h2 class="text-primary mb-4">User Management</h2>
    <button @click="openAddUserModal" class="btn btn-danger mb-4">
      <i class="fas fa-plus"></i> Add User
    </button>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search for a user"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">Loading users...</div>

    <table class="table table-bordered" v-if="!loading && filteredUsers.length">
      <thead>
        <tr>
          <th>ID</th> <!-- Nouvelle colonne pour l'ID -->
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td> <!-- Affichage de l'ID -->
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button
              @click="viewUser(user)"
              class="btn btn-outline-info me-2"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editUser(user)"
              class="btn btn-outline-warning me-2"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteUser(user.id)"
              class="btn btn-outline-danger"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !filteredUsers.length" class="alert alert-warning">
      No users found.
    </div>

    <user-form
      v-if="showModal"
      :user="currentUser"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore"; // Assurez-vous que ce store existe
import UserForm from "./UserForm.vue"; // Importez le formulaire utilisateur
import Swal from "sweetalert2";

const userStore = useUserStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const editMode = ref(false);
const currentUser = ref({ id: "", name: "", email: "", role: "" }); // Ajout de l'id ici

onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;
  await userStore.fetchUsers();
  loading.value = false;
};

const filteredUsers = computed(() =>
  userStore.users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const openAddUserModal = () => {
  currentUser.value = { id: "", name: "", email: "", role: "" }; // Assurez-vous d'initialiser l'ID
  editMode.value = false;
  showModal.value = true;
};

const viewUser = (user) => {
  currentUser.value = { ...user };
  showModal.value = true;
};

const editUser = (user) => {
  currentUser.value = { ...user };
  editMode.value = true;
  showModal.value = true;
};

const deleteUser = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this user!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await userStore.deleteUser(id);
      Swal.fire("Deleted!", "The user has been deleted.", "success");
      fetchUsers();
    } catch (error) {
      console.error("Error during deletion:", error);
      Swal.fire("Error", "An error occurred during deletion", "error");
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
};
</script>

<style>
.search-input {
  max-width: 250px;
}
</style>
