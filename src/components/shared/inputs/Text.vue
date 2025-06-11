<template>
  <div class="p-field">
    <label :for="name">{{ localizedLabel }}</label>
    <InputText
      :id="name"
      :type="type"
      v-model="value"
      :placeholder="placeholder"
      :class="{ 'p-invalid': hasError }"
      aria-describedby="text-error"
      @input="handleInput"
    />
    <small class="p-error error-message" id="text-error" v-if="hasError">
      {{ errorMessageCombined }}
    </small>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useField } from "vee-validate";
import { useErrorsStore } from "@/stores/errors";
import InputText from "primevue/inputtext";
import { useI18n } from "vue-i18n";

const formErrorsStore = useErrorsStore();
const { t } = useI18n();

// Define props for the BaseInput component
const props = defineProps({
  name: {
    // The name of the field, used by VeeValidate
    type: String,
    required: true,
  },
  label: {
    // The label to display for the input
    type: String,
    required: true,
  },
  rules: {
    // Validation rules for the field (e.g., 'required|email')
    type: [String, Object],
    default: "",
  },
  type: {
    // The HTML input type (e.g., 'text', 'email', 'password')
    type: String,
    default: "text",
  },
  placeholder: {
    // Placeholder text for the input
    type: String,
    default: "",
  },
});

// Destructure props to maintain reactivity
const { name, rules } = toRefs(props);

// Use useField to link the input to VeeValidate's form state
// It provides the field's value, error message, and metadata
const { value, errorMessage, meta, handleChange } = useField(name, rules);

const errorMessageCombined = computed(
  () => formErrorsStore.errors[name.value] || errorMessage.value
);

const hasError = computed(() => !!errorMessageCombined.value);
// Compute a localized label if the label prop is a translation key
const localizedLabel = computed(() => t(props.label));

const handleInput = (event) => {
  formErrorsStore.clearErrors();
  handleChange(event);
};
</script>

<style scoped>
/* Scoped styles for BaseInput component */
.p-field {
  margin-bottom: 1.5rem; /* Space between form fields */
}

.p-field label {
  display: block; /* Make label take full width */
  margin-bottom: 0.5rem; /* Space between label and input */
  font-weight: bold; /* Bold text for labels */
}

.p-inputtext {
  width: 100%; /* Input takes full width of its container */
  padding: 0.75rem; /* Padding inside the input */
  border: 1px solid #ced4da; /* Default border color */
  border-radius: 6px; /* Rounded corners */
  font-size: 1rem; /* Font size */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.p-inputtext:focus {
  border-color: #007bff; /* Border color on focus */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Shadow on focus */
  outline: none; /* Remove default outline */
}

.p-inputtext.p-invalid {
  border-color: #ef4444; /* Red border for invalid fields */
}

.error-message {
  color: #ef4444; /* Red color for error messages */
  font-size: 0.875rem; /* Smaller font size for error messages */
  margin-top: 0.25rem; /* Space above error message */
}
</style>
