<template>
  <div class="ms-2">
    <Button
      v-if="locale !== 'en'"
      severity="secondary"
      @click="changeLocale('en')"
      class="custom-button"
    >
      <i class="pi pi-globe"></i>
      English
    </Button>
    <Button
      v-else
      severity="secondary"
      @click="changeLocale('ar')"
      class="custom-button"
    >
      <i class="pi pi-globe"></i>
      العربية
    </Button>
  </div>
</template>
<script setup>
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";

const { locale } = useI18n();

function changeLocale(lang) {
  locale.value = lang;
}

// Compute direction based on locale
const direction = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));

// Watch for locale changes and update document direction
watch(locale, (newLocale) => {
  document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
});
</script>
