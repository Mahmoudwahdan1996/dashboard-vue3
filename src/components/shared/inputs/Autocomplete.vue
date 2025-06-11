<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <AutoComplete
      :id="name"
      v-model="field.value"
      :suggestions="suggestions"
      :class="{ 'p-invalid': hasError }"
      :aria-describedby="hasError ? `${name}-error` : null"
      @complete="search"
      @input="handleInput"
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
import AutoComplete from "primevue/autocomplete";

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
});

const formErrorsStore = useErrorsStore();
const { value: fieldValue, errorMessage, handleChange } = useField(props.name);
const field = { value: fieldValue, errorMessage };

const errorMessageCombined = computed(
  () => formErrorsStore.errors[props.name] || errorMessage.value
);
const hasError = computed(() => !!errorMessageCombined.value);

const suggestions = ref([]);
const search = async (event) => {
  suggestions.value = [
    { label: `${event.query} 1`, value: `${event.query}1` },
    { label: `${event.query} 2`, value: `${event.query}2` },
  ]; // Replace with real API call
};

const handleInput = (event) => {
  formErrorsStore.clearErrorField(props.name);
  handleChange(event);
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
