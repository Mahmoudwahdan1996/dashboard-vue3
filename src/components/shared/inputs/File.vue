<template>
  <!-- File input for image selection -->
  <input
    type="file"
    ref="fileInput"
    :accept="accept"
    @change="handleFileChange"
    style="display: none"
    id="image-upload"
    :multiple="multiple"
  />
  <Button
    :label="t(label)"
    icon="pi pi-upload"
    @click="triggerFileInput"
    outlined
    class="custom-button mb-2"
    :loading="isUploading"
  />

  <!-- Image preview with delete icon -->
  <div v-if="isUploading" class="mt-2">Uploading...</div>
  <div
    v-if="imagePreview.length"
    class="flex flex-wrap justify-start gap-5 items-center mt-2"
  >
    <div v-for="(image, index) in imagePreview" :key="index" class="relative">
      <img
        :src="image"
        alt="Product Image Preview"
        class="max-w-[200px] h-auto border-2 border-gray-300"
      />
      <Button
        icon="pi pi-trash"
        class="p-button-danger p-button-rounded p-button-icon-only !absolute top-[50%] right-[50%] translate-x-1/2"
        @click="removeImage(index)"
      />
    </div>
  </div>

  <!-- Error message for invalid file -->
  <div v-if="hasError" class="mt-2">
    <Message severity="error">{{ getError }}</Message>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, watch } from "vue";
import Button from "primevue/button";
import Message from "primevue/message";
import { useApi } from "@/composables/useApi";
import { useField } from "vee-validate";
import { useI18n } from "vue-i18n";

const { uploadFile } = useApi();
const fileInput = ref(null);
const imagePreview = ref([]);
const errorMessage = ref("");
const isUploading = ref(false);
const { t } = useI18n();

const props = defineProps({
  name: { type: String, required: true },
  rules: { type: String, default: "" },
  label: { type: String, default: "upload_image" },
  multiple: { type: Boolean, default: false },
  accept: { type: String, default: "image/*" },
  maxSize: { type: Number, default: 2048 }, // Max file size in KB (default 2MB)
  maxLength: { type: Number, default: 5 },
  initialImages: { type: Array, default: () => [] }, // For setting pre-existing images
});

const { rules, name, initialImages } = toRefs(props);
const { value: fieldValue, errorMessage: fieldErrorMessage } = useField(
  name,
  rules
);

const hasError = computed(
  () => !!fieldErrorMessage.value || !!errorMessage.value
);
const getError = computed(() => fieldErrorMessage.value || errorMessage.value);

// Convert URL to base64
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Base64 conversion error:", error);
    throw error;
  }
};

// Initialize with pre-existing images
watch(
  initialImages,
  async (newImages) => {
    if (newImages?.length) {
      try {
        isUploading.value = true;
        const base64Images = await Promise.all(newImages.map(urlToBase64));
        fieldValue.value = [...newImages]; // Store original URLs
        imagePreview.value = [...base64Images]; // Use base64 for display
      } catch (error) {
        errorMessage.value = t("image_load_failed");
      } finally {
        isUploading.value = false;
      }
    }
  },
  { immediate: true }
);

// Sync imagePreview with fieldValue
watch(
  fieldValue,
  async (newValue) => {
    if (newValue?.length) {
      try {
        isUploading.value = true;
        const base64Images = await Promise.all(newValue.map(urlToBase64));
        imagePreview.value = [...base64Images];
      } catch (error) {
        errorMessage.value = t("image_load_failed");
      } finally {
        isUploading.value = false;
      }
    } else {
      imagePreview.value = [];
    }
  },
  { immediate: true }
);

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file selection and upload
const handleFileChange = async (event) => {
  const files = Array.from(event.target.files);
  errorMessage.value = "";
  isUploading.value = true;

  // Validate number of files
  if (files.length > props.maxLength) {
    errorMessage.value = t("too_many_files", { max: props.maxLength });
    isUploading.value = false;
    return;
  }

  // Validate file type and size
  const validFiles = files.filter((file) => {
    const isImage = file.type.startsWith("image/");
    const isValidSize = file.size / 1024 <= props.maxSize;
    if (!isImage) {
      errorMessage.value = t("invalid_image_file");
      return false;
    }
    if (!isValidSize) {
      errorMessage.value = t("file_too_large", { max: props.maxSize });
      return false;
    }
    return true;
  });

  if (!validFiles.length) {
    isUploading.value = false;
    return;
  }

  try {
    // Generate local previews
    const previews = await Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          })
      )
    );
    imagePreview.value = [...previews]; // Show local previews immediately

    // Upload files sequentially
    const uploadedUrls = [];
    for (const file of validFiles) {
      const response = await uploadFile("/files/upload", file);
      if (response.location) {
        uploadedUrls.push(response.location);
      } else {
        throw new Error("No location in response");
      }
    }

    // Update fieldValue with uploaded URLs
    fieldValue.value = [...uploadedUrls];
    // imagePreview will update via the watcher
    fileInput.value.value = null; // Reset file input
  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value = t("upload_failed");
    imagePreview.value = []; // Clear previews on error
  } finally {
    isUploading.value = false;
  }
};

// Remove image
const removeImage = (index) => {
  const newFieldValue = [...fieldValue.value];
  newFieldValue.splice(index, 1);
  fieldValue.value = newFieldValue;
  errorMessage.value = "";
};

// Handle image loading errors
</script>

<style scoped>
.p-button {
  margin-right: 0.5rem;
}
.image-upload-container {
  position: relative;
}
.delete-icon {
  z-index: 10;
}
</style>
