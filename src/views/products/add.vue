<template>
  <div>
    <BreadCrumb> </BreadCrumb>
    <Card
      class="my-4 rounded-md"
      :pt="{ body: 'dark:bg-zinc-600 dark:text-zinc-100 p-4' }"
    >
      <template #title>
        <h3 class="text-2xl font-bold mb-2 ms-2">{{ t("add_product") }}</h3>
      </template>
      <template #content>
        <ProductsForm />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

import Card from "primevue/card";

import BreadCrumb from "@/components/layout/BreadCrumb.vue";
import ProductsForm from "@/components/products/form.vue";

const { t } = useI18n();
</script>
