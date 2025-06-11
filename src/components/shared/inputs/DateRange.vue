<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <Calendar
      :id="name"
      v-model="field.value"
      :showIcon="true"
      selectionMode="range"
      :class="{ 'p-invalid': hasError }"
      :aria-describedby="hasError ? `${name}-error` : null"
      @input="handleInput"
    />
    <small v-if="hasError" :id="`${name}-error`" class="p-error">
      {{ errorMessage || field.errorMessage }}
    </small>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useField } from "vee-validate";
import { useErrorsStore } from "@/stores/errors";
import Calendar from "primevue/calendar";

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
