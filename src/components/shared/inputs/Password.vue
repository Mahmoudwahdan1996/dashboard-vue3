<template>
  <FloatLabel variant="on">
    <Password
      v-model="value"
      inputId="password"
      toggleMask
      @input="handleInput"
      :class="{ 'p-invalid': hasError }"
      :placeholder="placeholder"
    />
    <label for="password">
      {{ localizedLabel }}
    </label>
  </FloatLabel>
  <small class="p-error error-message" id="text-error" v-if="hasError">
    {{ errorMessageCombined }}
  </small>
</template>

<script setup>
import { computed, toRefs } from "vue";
import Password from "primevue/password";
import { useField } from "vee-validate";
import { useErrorsStore } from "@/stores/errors";
import { useI18n } from "vue-i18n";

const formErrorsStore = useErrorsStore();
const { t } = useI18n();

// Define props for the BaseInput component
const props = defineProps({
  name: { type: String, required: true },
  rules: { type: String, default: "" },
  label: { type: String, default: "password" },
  placeholder: { type: String, default: "" },
});

// Destructure props
const { name, rules } = toRefs(props);

// Define computed properties
const { value, errorMessage } = useField(name.value, rules.value);

const errorMessageCombined = computed(
  () => formErrorsStore.errors[name.value] || errorMessage.value
);
const hasError = computed(() => !!errorMessage.value);

// Compute a localized label if the label prop is a translation key
const localizedLabel = computed(() => t(props.label));

// Define methods
const handleInput = (event) => {
  formErrorsStore.clearErrorField(name.value);
  value.value = event;
};
</script>
