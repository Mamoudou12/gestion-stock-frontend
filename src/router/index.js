import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/AuthStore";

// Composants principaux
import Dashboard from "../components/Dashboard.vue";
import Login from "../components/Login.vue";

// Composants Produits
import ProductList from "../components/products/ProductList.vue";
import ProductForm from "../components/products/ProductForm.vue";

// Composants Fournisseurs
import SupplierList from "../components/suppliers/SupplierList.vue";
import SupplierForm from "../components/suppliers/SupplierForm.vue";

// Composants Réception
import ReceptionList from "../components/receptions/ReceptionList.vue";
import ReceptionForm from "../components/receptions/ReceptionForm.vue";

// Composants Utilisateurs
import UserList from "../components/users/UserList.vue";
import UserForm from "../components/users/UserForm.vue";

// Composants Inventaire
import InventoryList from "../components/inventory/InventoryList.vue";
import InventoryForm from "../components/inventory/InventoryForm.vue";

// Composants Ventes
import SaleList from "../components/sales/SaleList.vue";
import SaleForm from "../components/sales/SaleForm.vue";

// Composants Mouvements de Stock
import MovementList from "../components/movements/MovementList.vue";
import Home from "../components/Home.vue";
const routes = [
  { path: "/", component: Login },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: "home", name: "home", component: Home },
      // Routes Produits
      { path: "products", name: "product-list", component: ProductList },
      { path: "products/add", name: "product-add", component: ProductForm },
      {
        path: "products/edit/:id",
        name: "product-edit",
        component: ProductForm,
      },

      // Routes Fournisseurs
      { path: "suppliers", name: "supplier-list", component: SupplierList },
      { path: "suppliers/add", name: "supplier-add", component: SupplierForm },
      {
        path: "suppliers/edit/:id",
        name: "supplier-edit",
        component: SupplierForm,
      },

      // Routes Réceptions
      { path: "receptions", name: "reception-list", component: ReceptionList },
      {
        path: "receptions/add",
        name: "reception-add",
        component: ReceptionForm,
      },
      {
        path: "receptions/edit/:id",
        name: "reception-edit",
        component: ReceptionForm,
      },

      // Routes Utilisateurs
      { path: "users", name: "user-list", component: UserList },
      { path: "users/add", name: "user-add", component: UserForm },
      { path: "users/edit/:id", name: "user-edit", component: UserForm },

      // Routes Inventaire
      { path: "inventory", name: "inventory-list", component: InventoryList },
      {
        path: "inventory/add",
        name: "inventory-add",
        component: InventoryForm,
      },
      {
        path: "inventory/edit/:id",
        name: "inventory-edit",
        component: InventoryForm,
      },

      // Routes Ventes
      { path: "sales", name: "sale-list", component: SaleList },
      { path: "sales/add", name: "sale-add", component: SaleForm },
      { path: "sales/edit/:id", name: "sale-edit", component: SaleForm },

      // Routes Mouvements de Stock
      { path: "movements", name: "movement-list", component: MovementList },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
