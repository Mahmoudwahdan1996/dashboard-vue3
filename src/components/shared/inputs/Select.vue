<!-- <template>
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
      @change="handleInput"
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
</style> -->

<template>
  <div class="p-field">
    <label :for="name">{{ localizedLabel }}</label>
    <Dropdown
      class="w-full"
      :id="name"
      v-model="value"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :class="{ 'p-invalid': hasError }"
      aria-describedby="select-error"
      @change="handleChangeEvent"
    />
    <small class="p-error error-message" id="select-error" v-if="hasError">
      {{ errorMessageCombined }}
    </small>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { useField } from "vee-validate";
import { useErrorsStore } from "@/stores/errors";
import Dropdown from "primevue/dropdown";
import { useI18n } from "vue-i18n";

const formErrorsStore = useErrorsStore();
const { t } = useI18n();

// Define props for the SelectInput component
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  rules: {
    type: [String, Object],
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  optionLabel: {
    type: String,
    default: "label",
  },
  optionValue: {
    type: String,
    default: "value",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

// Destructure props to maintain reactivity
const { name, rules } = toRefs(props);

// Use useField to link the select to VeeValidate's form state
const { value, errorMessage, meta, handleChange } = useField(name, rules);

const errorMessageCombined = computed(
  () => formErrorsStore.errors[name.value] || errorMessage.value
);

const hasError = computed(() => !!errorMessageCombined.value);

// Compute a localized label if the label prop is a translation key
const localizedLabel = computed(() => t(props.label));

const handleChangeEvent = (event) => {
  formErrorsStore.clearErrors();
  handleChange(event.value);
};
</script>

<style scoped>
/* Scoped styles for SelectInput component */
.p-field {
  margin-bottom: 1.5rem;
}

.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.p-dropdown {
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.p-dropdown:not(.p-disabled):hover {
  border-color: #007bff;
}

.p-dropdown:not(.p-disabled).p-focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.p-dropdown.p-invalid {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
