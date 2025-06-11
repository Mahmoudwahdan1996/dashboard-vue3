<template>
  <Toolbar
    class="fixed end-0 start-0 px-4 shadow z-9 dark:!border-none dark:!bg-zinc-900 dark:!text-white"
    :class="isAlwaysOpen ? 'md:ms-60' : 'md:ms-[64px]'"
  >
    <template #start>
      <Button
        class="mr-2 md:!hidden"
        @click="() => $emit('changeSidebar')"
        severity="secondary"
        text
      >
        <i class="pi pi-bars"></i>
      </Button>

      <ThemeSwitcher />
      <LanguageSwitcher />
    </template>

    <template #end>
      <div class="flex items-center gap-2">
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          style="width: 32px; height: 32px"
        />
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="secondary"
          class="!border-zinc-900 hover:!bg-zinc-900 hover:!text-zinc-100 dark:!bg-zinc-900 dark:!text-zinc-100 dark:!border-zinc-100 dark:hover:!bg-zinc-100 dark:hover:!text-zinc-900"
          @click="logout"
        />
      </div>
    </template>
  </Toolbar>
</template>

<script setup>
import { computed, watch } from "vue";

import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import Avatar from "primevue/avatar";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
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
const { logout } = useAuthStore();
const { searchText, setSearchText } = useSearchStore();
// Sidebar logic
const isAlwaysOpen = computed(() => props.showSidebarAlways);
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
