<template>
  <Toast />
  <DynamicDialog />
  <ConfirmDialog></ConfirmDialog>

  <Header
    @changeSidebar="showSidebar = true"
    :showSidebarAlways="showSidebarAlways"
  />
  <SideBar
    @changeSidebarAlways="handleSidebarAlways"
    v-model:visible="showSidebar"
  />
  <main
    class="flex-1 p-6 pt-20 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 min-h-[100vh]"
    :class="showSidebarAlways ? 'md:ms-60' : 'md:ms-[64px]'"
  >
    <router-view />
  </main>
</template>

<script setup>
import { ref } from "vue";
import Header from "@/components/layout/header.vue";
import SideBar from "@/components/layout/sideBar.vue";
import DynamicDialog from "primevue/dynamicdialog";
import ConfirmDialog from "primevue/confirmdialog";

import Toast from "primevue/toast";
const showSidebar = ref(false);
const showSidebarAlways = ref(false);

const handleSidebarAlways = (sidebarAlwaysState) => {
  showSidebarAlways.value = sidebarAlwaysState;
};
</script>
