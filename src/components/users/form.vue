<template>
  <form @submit="submitProduct">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-2 border-zinc-900 dark:border-zinc-100 px-4 py-2 rounded-2xl"
    >
      <div>
        <InputText name="name" label="name" rules="required|minlength:3" />
      </div>

      <div>
        <InputText name="email" label="email" rules="required|email" />
      </div>
      <div>
        <PasswordInput name="password" label="password" rules="required" />
      </div>

      <div>
        <InputText
          name="role"
          label="role"
          rules="required|minlength:3"
          placeholder="user/admin"
        />
      </div>

      <div class="col-span-2 md:col-span-3">
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
import PasswordInput from "@/components/shared/inputs/Password.vue";

const { get, put, post, loading } = useApi();
const route = useRoute();
const router = useRouter();
const { showToast } = useToasted();
const isCreate = ref(route.name === "AddUser");
// Reactive state for form and response
const { handleSubmit, setValues } = useForm({
  initialValues: {
    email: "string",
    name: "string",
    password: "string",
    role: "string",
    avatar: [],
  },
});

onMounted(() => {
  if (!isCreate.value) getUser();
});

// Submit product form with image
const submitProduct = handleSubmit((values) => {
  if (isCreate.value) {
    post("/users", { ...values, avatar: values.avatar[0] }).then((res) => {
      showToast("success", "Success", "Product created successfully");
      router.push({ name: "Products" });
    });
  } else {
    put(`/users/${route.params.id}`, {
      ...values,
      avatar: values.avatar[0],
    }).then((res) => {
      showToast("success", "Success", "Product updated successfully");
      router.push({ name: "Products" });
    });
  }
});

const getUser = async () => {
  get(`/users/${route.params.id}`).then((res) => {
    setValues({ ...res, avatar: [res.avatar] });
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
