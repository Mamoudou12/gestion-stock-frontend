import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/AuthStore';
import 'bootstrap/dist/css/bootstrap.css'; 
import 'bootstrap'; 
import { createI18n } from 'vue-i18n';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';




// Importer les fichiers de langues
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import pl from './locales/pl.json';
import esp from './locales/esp.json';

const messages = {
  en,
  fr,
  ar,
  pl,
  esp,
};

// Créer une instance d'i18n
const i18n = createI18n({
  locale: 'en', // langue par défaut
  messages,
});



const app = createApp(App);
const pinia = createPinia();
app.use(i18n); 
app.use(Toast);
app.use(router);
app.use(pinia);
app.mount('#app');

const authStore = useAuthStore();
authStore.checkAuth(); // Vérifiez l'authentification au démarrage

