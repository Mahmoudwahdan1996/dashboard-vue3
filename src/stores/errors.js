import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorsStore = defineStore("errors", () => {
  const errors = ref({
    name: "should be found",
  });

  const setErrors = (newErrors) => {
    errors.value = { ...newErrors };
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const clearErrorField = (field) => {
    if (errors.value[field]) {
      errors.value = { ...errors.value, [field]: null };
    }
  };

  return { errors, setErrors, clearErrors, clearErrorField };
});
