import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { useDark, useToggle } from "@vueuse/core";
import { createPinia } from "pinia";
import router from "./router";
import i18n from "./i18n"; // Import i18n configuration
// PrimeVue
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css"; // PrimeIcons
import { registerPrimeVueComponents } from "./primevue-config";
import ToastService from "primevue/toastservice";
import DialogService from "primevue/dialogservice";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: "primevue",
        order: "theme, base, primevue",
      },
    },
  },
});
registerPrimeVueComponents(app); // Register components
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);
app.use(i18n); // Add vue-i18n

// Theme toggle setup
const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);

app.provide("toggleDark", toggleDark);
app.provide("isDark", isDark);

app.mount("#app");
