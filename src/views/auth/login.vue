<template>
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <div class="flex justify-center items-center">
      <Card
        class="w-[100%] md:w-[80%] xl:w-[80%] border-2 border-zinc-900 m-4 !bg-linear-to-r from-zinc-100 to-zinc-300"
      >
        <template #title>Login </template>
        <template #subtitle>please login to continue</template>
        <template #content>
          <form @submit="onSubmit">
            <div class="mt-4">
              <div>
                <InputText name="email" label="email" rules="" />
              </div>
              <div>
                <InputText name="password" label="password" rules="" />
              </div>
            </div>
            <div class="flex justify-end">
              <Button
                type="submit"
                :loading="loading"
                class="w-[50%] !border-zinc-500 !bg-zinc-500 !text-zinc-100"
                >Submit</Button
              >
            </div>
          </form>
        </template>
      </Card>
    </div>
    <div
      class="hidden md:block w-full h-full bg-[url(@/assets/login-1.svg)] bg-contain bg-no-repeat bg-center"
    ></div>
  </div>
</template>

<script setup>
import InputText from "@/components/shared/inputs/Text.vue";
import Card from "primevue/card";
import { useForm } from "vee-validate";
import { useApi } from "@/composables/useApi";
import { Button } from "primevue";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const { login } = useAuthStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);

const { handleSubmit } = useForm({
  initialValues: {
    email: "john@mail.com",
    password: "changeme",
  },
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    const res = await login(values);
    const redirectPath = route.query.redirect || { name: "default" };
    router.push(redirectPath);
  } catch (err) {
  } finally {
    loading.value = false;
  }
});
</script>

<style></style>
