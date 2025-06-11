<template>
  <div>
    <BreadCrumb>
      <template #actions>
        <Button
          class="me-2 my-2 w-[100px] custom-button"
          @click="showCategoryDialog"
        >
          {{ t("add") }}
        </Button>
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
            {{ t("products") }}
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
        <FilterCategories :filters="filters" @resetFilters="resetFilters" />
        <CategoriesTable
          :filters="filters"
          @handleEdit="handleEdit"
          @handleDelete="handleDelete"
          ref="table"
        />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "primevue/usedialog";

import Button from "primevue/button";
import Card from "primevue/card";

import FilterCategories from "@/components/categories/filter.vue";
import CategoriesTable from "@/components/categories/table.vue";
import BreadCrumb from "@/components/layout/BreadCrumb.vue";

const dynamicComponent = defineAsyncComponent(() =>
  import("@/components/categories/form.vue")
);

const { t } = useI18n();
const dialog = useDialog();

const categoryId = ref(null);
const table = ref(null);
const showCategoryDialog = () => {
  dialog.open(dynamicComponent, {
    props: {
      header: "Product List",
      style: {
        width: "50vw",
      },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
      modal: true,
      dismissableMask: true,
    },
    data: {
      id: categoryId.value,
    },
    onClose: (opt) => {
      categoryId.value = null;
      table.value.fetchData();
      // {selectedId: 12}
    },
  });
};
const handleEdit = (id) => {
  categoryId.value = id;
  showCategoryDialog();
};
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

<style scoped>
.product-form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
}

.field {
  margin-bottom: 1rem;
}

.p-button {
  margin-right: 0.5rem;
}
</style>
