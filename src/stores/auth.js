import { useApi } from "@/composables/useApi";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const token = useLocalStorage("token", () => "");
  const isAuthenticated = useLocalStorage("isAuthenticated", () => false);
  const user = ref(null);

  const router = useRouter();
  const { get, post } = useApi();

  const login = async (data) => {
    try {
      const response = await post("/auth/login", data);
      console.log(response);
      token.value = response.access_token;
      isAuthenticated.value = true;
    } catch (error) {
      isAuthenticated.value = false;
      console.error(error);
    }
  };

  const logout = () => {
    token.value = "";
    isAuthenticated.value = false;
    user.value = null;
    router.push("/login");
  };
  return { user, isAuthenticated, token, login };
});
