<template>
  <div
    class="card flex justify-between bg-white dark:bg-zinc-900 dark:text-white"
  >
    <BreadCrumb
      class="!bg-white dark:!bg-zinc-900 dark:!text-white"
      :model="breadcrumbItems"
    >
      <template #item="{ item }">
        <span
          v-if="item.command"
          href="#"
          class="cursor-pointer"
          @click="item.command"
        >
          {{ item.label }}
        </span>
        <span v-else>{{ item.label }}</span>
      </template>
    </BreadCrumb>
    <slot name="actions"></slot>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import BreadCrumb from "primevue/breadcrumb";
import { ref, computed } from "vue";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Compute breadcrumb items from route meta
const breadcrumbItems = computed(() => {
  const items = route.meta.breadcrumb || [];
  return items.map((item) => ({
    label: item.dynamic
      ? route.params[item.label] || t(item.label)
      : t(item.label),
    to: item.to,
    command: item.to ? () => router.push(item.to) : undefined,
  }));
});
</script>

<!-- <style scoped>
.dark .p-breadcrumb {
  background-color: violet;
}
</style> -->
