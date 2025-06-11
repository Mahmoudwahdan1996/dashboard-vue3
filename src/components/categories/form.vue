<template>
  <form @submit="submitProduct">
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-zinc-900 dark:border-zinc-100 px-4 py-2 rounded-2xl"
    >
      <div>
        <InputText name="name" label="name" rules="required|minlength:3" />
      </div>

      <div class="md:col-span-1 flex justify-center">
        <!-- Image upload component -->
        <!-- <ImageUpload
          name="images"
          label="upload category image"
          accept="image/*"
          rules=""
          :multiple="true"
        /> -->
        <div
          class="image-upload-container inline-flex flex-col items-end rounded-lg p-4 border-2 border-zinc-900 dark:border-zinc-100"
        >
          <ImageUpload
            name="image"
            label="upload_images"
            rules="required"
            :multiple="false"
            accept="image/png,image/jpeg"
            :max-size="2048"
            :max-length="1"
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
        <Button
          label="Cancel"
          class="!border-zinc-900 w-[150px] !bg-zinc-950 !text-zinc-100"
          @click="closeDialog"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useForm } from "vee-validate";
import { useApi } from "@/composables/useApi";
import { useToasted } from "@/composables/useToasted";

import Button from "primevue/button";

import ImageUpload from "@/components/shared/inputs/File.vue";
import InputText from "@/components/shared/inputs/Text.vue";

const { get, put, post, loading } = useApi();
const { showToast } = useToasted();

const { handleSubmit, setValues } = useForm({
  initialValues: {
    name: "category",
    image: [],
  },
  validateOnMount: true,
});

onMounted(() => {
  if (dialogRef.value.data.id !== null) getCategory();
});

const dialogRef = inject("dialogRef");

const closeDialog = () => {
  dialogRef.value.close();
};

const submitProduct = handleSubmit((values) => {
  if (!dialogRef.value.data.id) {
    post("/categories", { ...values, image: values.image[0] })
      .then((res) => {
        closeDialog();
        showToast("success", "Success", "category created successfully");
      })
      .catch((err) => console.log(err));
  } else {
    put(`/categories/${dialogRef.value.data.id}`, {
      ...values,
      image: values.image[0],
    }).then((res) => {
      closeDialog();

      showToast("success", "Success", "category updated successfully");
    });
  }
});

const getCategory = async () => {
  get(`/categories/${dialogRef.value.data.id}`).then((res) => {
    setValues({ ...res, image: [res.image] });
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
