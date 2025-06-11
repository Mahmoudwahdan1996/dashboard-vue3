import { createI18n } from "vue-i18n";
import en from "./lang/en.json";
import ar from "./lang/ar.json";
import { defineRule } from "vee-validate";
import { required, min, size, email, min_value } from "@vee-validate/rules";

// Define your translation messages
const messages = {
  en: { ...en },
  ar: { ...ar },
};

// Create i18n instance
const i18n = createI18n({
  locale: "en", // Default locale
  fallbackLocale: "en", // Fallback locale
  messages,
});

// Register VeeValidate rules with localized messages
defineRule("required", (value, params, ctx) => {
  if (!required(value)) {
    return i18n.global.t("validation.required", {
      field: i18n.global.t(`fields.${ctx.field}`),
    });
  }
  return true;
});

defineRule("minlength", (value, [length], ctx) => {
  if (!min(value, { length: parseInt(length) })) {
    return i18n.global.t("validation.minlength", {
      field: i18n.global.t(`fields.${ctx.field}`),
      length,
    });
  }
  return true;
});

defineRule("size", (value, [length], ctx) => {
  if (!size(value, { length: parseInt(length) })) {
    return i18n.global.t("validation.size", {
      field: i18n.global.t(`fields.${ctx.field}`),
      length,
    });
  }
  return true;
});

defineRule("email", (value, params, ctx) => {
  if (!email(value)) {
    return i18n.global.t("validation.email", {
      field: i18n.global.t(`fields.${ctx.field}`),
    });
  }
  return true;
});
defineRule("min_value", (value, [minValue], ctx) => {
  if (value < minValue) {
    return i18n.global.t("validation.min_value", {
      field: i18n.global.t(`fields.${ctx.field}`),
      minValue,
    });
  }
  return true;
});
export default i18n;
