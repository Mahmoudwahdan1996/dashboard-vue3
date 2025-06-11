import { useToast } from "primevue/usetoast";

export function useToasted() {
  const toast = useToast();

  const showToast = (severity, summary, detail) => {
    toast.add({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  return { showToast };
}
