import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

// Function to register PrimeVue components globally
export function registerPrimeVueComponents(app) {
  app.component("PButton", Button);
  app.component("PInputText", InputText);
  app.component("PCard", Card);
  app.component("PDialog", Dialog);
  app.component("PDropdown", Dropdown);
  app.component("PToast", Toast);

  // Register services (e.g., for Toast)
  app.use(ToastService);
}
