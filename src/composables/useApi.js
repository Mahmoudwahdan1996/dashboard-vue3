import { ref, getCurrentInstance } from "vue";
import apiClient from "../axiosConfig";

export function useApi() {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const { appContext } = getCurrentInstance() || {};

  const showToast = (severity, summary, detail) => {
    if (appContext) {
      appContext.config.globalProperties.$toast.add({
        severity,
        summary,
        detail,
        life: 3000,
      });
    }
  };

  const get = async (url, params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get(url, { ...params });
      data.value = response;
      if (response.message) {
        showToast("success", "Success", response.message);
      }
      return response;
    } catch (err) {
      error.value = err;
      const errorMessage =
        err.response?.data?.message || "Failed to fetch data";
      showToast("error", "Error", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const post = async (url, payload) => {
    loading.value = true;
    error.value = null;
    try {
      console.log(payload);
      const response = await apiClient.post(url, payload);
      data.value = response;
      if (response.message) {
        showToast("success", "Success", response.message);
      }
      return response;
    } catch (err) {
      error.value = err;
      const errorMessage =
        err.response?.data?.message || "Failed to create resource";
      showToast("error", "Error", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const put = async (url, payload) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.put(url, payload);
      data.value = response;
      if (response.message) {
        showToast("success", "Success", response.message);
      }
      return response;
    } catch (err) {
      error.value = err;
      const errorMessage =
        err.response?.data?.message || "Failed to update resource";
      showToast("error", "Error", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const del = async (url) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiClient.delete(url);
      data.value = response;
      if (response.message) {
        showToast("success", "Success", response.message);
      }
      return response;
    } catch (err) {
      error.value = err;
      const errorMessage =
        err.response?.data?.message || "Failed to delete resource";
      showToast("error", "Error", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Composable API call wrapper for file uploads
  const uploadFile = async (url, files, config = {}) => {
    try {
      const formData = new FormData();

      formData.append("file", files); // Adjust the field name as per your API

      const response = await apiClient.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw error; // Error already formatted by interceptors
    }
  };

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    del,
    uploadFile,
  };
}
