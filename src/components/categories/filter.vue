<template>
  <div class="flex justify-center mt-8">
    <FloatLabel class="w-[50%]" variant="on">
      <InputText
        v-model="filters.title"
        labelId="title"
        class="w-full shadow-lg bg-zinc-200 border-zinc-900"
      />
      <label for="title" class="text-zinc-900 font-medium">{{
        t("title")
      }}</label>
    </FloatLabel>
  </div>

  <div class="grid grid-cols-3 gap-1 gap-y-1 my-6">
    <FloatLabel variant="on">
      <Select
        v-model="filters.categoryId"
        labelId="on_label"
        :options="categories"
        optionLabel="name"
        optionValue="id"
        class="w-full !border-2 !border-zinc-900"
      />
      <label for="on_label" class="!text-zinc-900 !font-medium">{{
        t("category")
      }}</label>
    </FloatLabel>

    <FloatLabel variant="on">
      <InputNumber
        v-model="filters.price_max"
        mode="currency"
        currency="USD"
        locale="en-US"
        labelId="price_max"
        class="w-full !border-2 !border-zinc-900 rounded-lg"
      />
      <label for="price_max" class="!text-zinc-900 !font-medium">{{
        t("price_max")
      }}</label>
    </FloatLabel>

    <FloatLabel variant="on">
      <InputNumber
        v-model="filters.price_min"
        mode="currency"
        currency="USD"
        locale="en-US"
        labelId="price_min"
        class="w-full !border-2 rounded-lg !border-zinc-900"
      />
      <label for="price_min" class="!text-zinc-900 !font-medium">{{
        t("price_min")
      }}</label>
    </FloatLabel>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import FloatLabel from "primevue/floatlabel";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import { useApi } from "@/composables/useApi";
import InputText from "primevue/inputtext";

const { t } = useI18n();

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});
const { get } = useApi();

const categories = ref([]);

onMounted(() => {
  getCategories();
});

const getCategories = async () => {
  try {
    const res = await get("/categories?limit=10");
    categories.value = res;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};
</script>
