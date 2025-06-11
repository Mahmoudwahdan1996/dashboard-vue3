<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <Dropdown
      :id="name"
      v-model="field.value"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :class="{ 'p-invalid': hasError }"
      :aria-describedby="hasError ? `${name}-error` : null"
      :loading="isLoading"
      @change="handleInput"
      @scroll="handleScroll"
    />
    <small v-if="hasError" :id="`${name}-error`" class="p-error">
      {{ errorMessage || field.errorMessage }}
    </small>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useField } from "vee-validate";
import { useErrorsStore } from "@/stores/errors";
import Dropdown from "primevue/dropdown";

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: Array, default: () => [] },
  optionLabel: { type: String, default: "label" },
  optionValue: { type: String, default: "value" },
});

const formErrorsStore = useErrorsStore();
const { value: fieldValue, errorMessage, handleChange } = useField(props.name);
const field = { value: fieldValue, errorMessage };

const errorMessageCombined = computed(
  () => formErrorsStore.errors[props.name] || errorMessage.value
);
const hasError = computed(() => !!errorMessageCombined.value);

const isLoading = ref(false);
const page = ref(1);

const handleScroll = async (event) => {
  const element = event.target;
  if (
    element.scrollTop + element.clientHeight >= element.scrollHeight - 10 &&
    !isLoading.value
  ) {
    isLoading.value = true;
    setTimeout(() => {
      const newOptions = Array.from({ length: 10 }, (_, i) => ({
        label: `Option ${page.value * 10 + i + 1}`,
        value: `value${page.value * 10 + i + 1}`,
      }));
      props.options.push(...newOptions);
      page.value += 1;
      isLoading.value = false;
    }, 1000); // Replace with real API call
  }
};

const handleInput = (event) => {
  formErrorsStore.clearErrorField(props.name);
  handleChange(event.value);
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.p-error {
  color: red;
  font-size: 0.85rem;
  display: block;
}
.p-invalid {
  border-color: red;
}
</style>
