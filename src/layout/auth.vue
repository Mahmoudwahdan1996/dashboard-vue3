<template>
  <Toolbar
    class="fixed end-0 start-0 px-4 shadow z-9 dark:!border-none dark:!bg-zinc-900 dark:!text-white"
  >
    <template #start>
      <ThemeSwitcher />
      <LanguageSwitcher />
    </template>
  </Toolbar>
  <main
    class="flex-1 p-6 pt-20 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 min-h-[100vh]"
  >
    <router-view />
  </main>
</template>

<script setup>
import { computed, watch } from "vue";

import Toolbar from "primevue/toolbar";

import LanguageSwitcher from "@/components/layout/languageSwitcher.vue";
import ThemeSwitcher from "@/components/layout/themeSwitcher.vue";

import { useSearchStore } from "@/stores/search";
import { useAuthStore } from "@/stores/auth";
// Props
const props = defineProps({
  showSidebarAlways: {
    type: Boolean,
    default: false,
  },
});
// Sidebar logic
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
.is-invalid {
  border: 1px solid red;
}
</style>
