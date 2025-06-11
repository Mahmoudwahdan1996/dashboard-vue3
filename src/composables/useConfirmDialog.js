import { useConfirm } from "primevue";

export function useConfirmDialog() {
  const confirm = useConfirm();

  const showConfirmDialog = (message, header, accept, reject) => {
    confirm.require({
      message,
      header,
      icon: "pi pi-info-circle",
      rejectLabel: "Cancel",
      rejectProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Delete",
        severity: "danger",
      },
      accept,
      reject,
    });
  };

  return { showConfirmDialog };
}
