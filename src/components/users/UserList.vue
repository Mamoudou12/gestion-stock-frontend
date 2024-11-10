<template>
  <div>
    <h2 class="text-primary mb-4">{{ $t("userManagement") }}</h2>
    <button @click="openAddUserModal" class="btn btn-primary mb-4">
      <i class="fas fa-plus"></i> {{ $t("addUser") }}
    </button>

    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('searchUser')"
      class="form-control mb-4 search-input"
    />

    <div v-if="loading" class="alert alert-info">{{ $t("loadingUsers") }}</div>

    <table
      class="table table-hover table-bordered"
      v-if="!loading && filteredUsers.length"
    >
      <thead>
        <tr>
          <th>{{ $t("id") }}</th>
          <th>{{ $t("name") }}</th>
          <th>{{ $t("email") }}</th>
          <th>{{ $t("role") }}</th>
          <th>{{ $t("status") }}</th>
          <th>{{ $t("actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span
              :class="{
                'badge bg-success': user.status,
                'badge bg-secondary': !user.status,
              }"
            >
              {{ user.status ? $t("active") : $t("inactive") }}
            </span>
          </td>
          <td>
            <div class="d-flex justify-content-center">
              <button
              @click="viewUser(user)"
              class="btn btn-outline-info me-2"
              :title="$t('view')"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editUser(user)"
              class="btn btn-outline-warning me-2"
              :title="$t('edit')"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="toggleUserStatus(user)"
              class="btn btn-outline-primary me-2"
              :title="user.status ? $t('deactivate') : $t('activate')"
            >
              <i
                :class="user.status ? 'fas fa-user-slash' : 'fas fa-user-check'"
              ></i>
            </button>
            <button
              @click="deleteUser(user.id)"
              class="btn btn-outline-danger"
              :title="$t('delete')"
            >
              <i class="fas fa-trash"></i>
            </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !filteredUsers.length" class="alert alert-warning">
      {{ $t("noUsersFound") }}
    </div>

    <!-- Modal for adding/editing user -->
    <user-form
      v-if="showModal && !showDetailModal"
      :user="currentUser"
      :edit-mode="editMode"
      @close="closeModal"
      @refresh="fetchUsers"
    />

    <!-- Modal for viewing user details -->
    <user-detail-modal
      v-if="showDetailModal"
      :user="currentUser"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import UserForm from "./UserForm.vue";
import UserDetailModal from "./UserView.vue";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const userStore = useUserStore();
const searchQuery = ref("");
const loading = ref(true);
const showModal = ref(false);
const showDetailModal = ref(false);
const editMode = ref(false);
const currentUser = ref({
  id: "",
  name: "",
  email: "",
  role: "",
  status: false,
});

onMounted(async () => {
  await fetchUsers();
});

const fetchUsers = async () => {
  loading.value = true;
  await userStore.fetchUsers();
  loading.value = false;
};

const filteredUsers = computed(() => {
  return userStore.users
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => {
      return b.status - a.status;
    });
});

const openAddUserModal = () => {
  currentUser.value = { id: "", name: "", email: "", role: "", status: false };
  editMode.value = false;
  showModal.value = true;
};

const viewUser = (user) => {
  currentUser.value = { ...user };
  showDetailModal.value = true;
};

const editUser = (user) => {
  currentUser.value = { ...user };
  editMode.value = true;
  showModal.value = true;
};

const toggleUserStatus = async (user) => {
  try {
    user.status = !user.status;
    await userStore.updateUserStatus(user.id, user.status);
    Swal.fire(
      t("success"),
      `${t("userStatusChanged")} ${
        user.status ? t("active") : t("inactive")
      }.`,
      "success"
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    Swal.fire(t("error"), t("updateStatusError"), "error");
  }
};

const deleteUser = async (id) => {
  const result = await Swal.fire({
    title: t("areYouSure"),
    text: t("deleteWarning"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: t("yesDelete"),
  });

  if (result.isConfirmed) {
    try {
      await userStore.deleteUser(id);
      Swal.fire(t("deleted"), t("userDeleted"), "success");
      fetchUsers();
    } catch (error) {
      console.error("Error during deletion:", error);
      Swal.fire(t("error"), t("deletionError"), "error");
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  editMode.value = false;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
};
</script>

<style>
.search-input {
  max-width: 250px;
}
</style>
