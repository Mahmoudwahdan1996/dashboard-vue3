<template>
  <div>
    <BreadCrumb>
      <template #actions>
        <router-link to="/users/add" v-slot="{ href, navigate }" custom>
          <Button
            class="me-2 my-2 w-[100px] custom-button"
            v-bind="{ href }"
            @click="navigate"
            role="link"
          >
            {{ t("add") }}
          </Button>
        </router-link>
      </template>
    </BreadCrumb>
    <Card
      class="my-4 rounded-md"
      :pt="{ body: 'dark:bg-zinc-600 dark:text-zinc-100 p-4' }"
    >
      <template #title>
        <div
          class="flex justify-between border-b-2 !border-zinc-500 dark:!border-zinc-50 p-5"
        >
          <h3 class="text-2xl font-bold mb-2 ms-2">
            {{ t("users") }}
          </h3>

          <Button
            class="place-self-start custom-button"
            @click="resetFilters"
            severity="secondary"
          >
            <i class="pi pi-refresh"></i>
            {{ t("reset_filters") }}
          </Button>
        </div>
      </template>

      <template #content>
        <FilterUsers :filters="filters" @resetFilters="resetFilters" />
        <UsersTable :filters="filters" />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import Card from "primevue/card";
import FilterUsers from "@/components/users/filter.vue";
import UsersTable from "@/components/users/table.vue";
import BreadCrumb from "@/components/layout/BreadCrumb.vue";

const { t } = useI18n();

const filters = ref({
  title: "",
  price_max: null,
  price_min: null,
  categoryId: null,
});

const resetFilters = () => {
  filters.value = {
    title: "",
    price_max: null,
    price_min: null,
    categoryId: null,
  };
};
</script>
