import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/AuthStore';


const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mount('#app');

const authStore = useAuthStore();
authStore.checkAuth(); // Vérifiez l'authentification au démarrage

