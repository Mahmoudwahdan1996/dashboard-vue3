<template>
  <form @submit="submitProduct">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-2 border-zinc-900 dark:border-zinc-100 px-4 py-2 rounded-2xl"
    >
      <div>
        <InputText name="title" label="title" rules="required|minlength:3" />
      </div>

      <div>
        <InputText
          name="description"
          label="description"
          rules="required|minlength:10"
        />
      </div>

      <div>
        <SelectInput
          name="categoryId"
          label="category"
          :options="categories"
          option-label="name"
          option-value="id"
          rules="required"
          placeholder="Select an option"
        />
      </div>

      <div>
        <InputText
          type="number"
          name="price"
          label="price"
          rules="required|min_value:1"
        />
      </div>

      <div class="col-span-2 md:col-span-3">
        <!-- Image upload component -->
        <!-- <ImageUpload
          name="images"
          label="upload image"
          rules="minlength:3"
          :multiple="true"
        /> -->
        <div
          class="image-upload-container flex flex-col items-end rounded-lg p-4 border-2 border-zinc-900 dark:border-zinc-100"
        >
          <ImageUpload
            name="images"
            label="upload_images"
            :multiple="true"
            accept="image/png,image/jpeg"
            :max-size="2048"
            :max-length="3"
          />
        </div>
      </div>
      <div class="flex justify-start mt-8">
        <Button
          type="submit"
          label="Submit"
          class="me-2 !border-zinc-900 w-[150px] !bg-zinc-950 !text-zinc-100"
          :loading="loading"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "@/composables/useApi";
import { useToasted } from "@/composables/useToasted";

import Button from "primevue/button";

import ImageUpload from "@/components/shared/inputs/File.vue";
import InputText from "@/components/shared/inputs/Text.vue";
import SelectInput from "@/components/shared/inputs/Select.vue";

const { get, put, post, loading } = useApi();
const route = useRoute();
const router = useRouter();
const { showToast } = useToasted();
const isCreate = ref(route.name === "AddProduct");
const categories = ref([]);
// Reactive state for form and response
const { handleSubmit, setValues } = useForm({
  initialValues: {
    title: "New Product",
    price: 10,
    description: "A description",
    categoryId: 1,
    images: [],
  },
});

onMounted(() => {
  getCategories();
  if (!isCreate.value) getProduct();
});

// Submit product form with image
const submitProduct = handleSubmit((values) => {
  if (isCreate.value) {
    post("/products", values).then((res) => {
      showToast("success", "Success", "Product created successfully");
      router.push({ name: "Products" });
    });
  } else {
    put(`/products/${route.params.id}`, values).then((res) => {
      showToast("success", "Success", "Product updated successfully");
      router.push({ name: "Products" });
    });
  }
});

const getCategories = async () => {
  get("/categories?limit=10").then((res) => {
    categories.value = res;
  });
};

const getProduct = async () => {
  get(`/products/${route.params.id}`).then((res) => {
    setValues({ ...res, categoryId: res.category.id, category: null });
    // Object.keys(res).forEach((key) => {
    //   form[key] = res[key];
    // });
  });
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
