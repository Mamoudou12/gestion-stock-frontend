import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export const useLanguageStore = defineStore("language", () => {
  const currentLanguage = ref("fr");
  const { locale } = useI18n();

  const changeLanguage = (newLanguage) => {
    currentLanguage.value = newLanguage;
    locale.value = newLanguage; // Met à jour la locale
  };

  return {
    currentLanguage,
    changeLanguage,
  };
});
