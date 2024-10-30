import { createRouter, createWebHistory } from "vue-router"; 
import { useAuthStore } from "../stores/AuthStore";

// Composants principaux
import Dashboard from "../components/Dashboard.vue";
import Login from "../components/Login.vue";

// Composants Produits
import ProductList from '../components/products/ProductList.vue';
import ProductForm from '../components/products/ProductForm.vue';

// Composants Fournisseurs
import SupplierList from '../components/suppliers/SupplierList.vue';
import SupplierForm from '../components/suppliers/SupplierForm.vue';

// Composants Réception
import ReceptionList from '../components/receptions/ReceptionList.vue';  // Liste des réceptions
import ReceptionForm from '../components/receptions/ReceptionForm.vue';  // Formulaire des réceptions

const routes = [
  { path: "/", component: Login },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      // Routes Produits
      { path: "products", name: "product-list", component: ProductList },
      { path: "products/add", name: "product-add", component: ProductForm },
      { path: "products/edit/:id", name: "product-edit", component: ProductForm },

      // Routes Fournisseurs
      { path: "suppliers", name: "supplier-list", component: SupplierList },
      { path: "suppliers/add", name: "supplier-add", component: SupplierForm },
      { path: "suppliers/edit/:id", name: "supplier-edit", component: SupplierForm },

      // Routes Réceptions
      { path: "receptions", name: "reception-list", component: ReceptionList },
      { path: "receptions/add", name: "reception-add", component: ReceptionForm },
      { path: "receptions/edit/:id", name: "reception-edit", component: ReceptionForm },
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
