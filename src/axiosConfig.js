// import axios from "axios";

// import { useErrorsStore } from "./stores/errors";

// // Base Axios instance with default configuration
// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || "https://api.example.com",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // Composable error handling for requests
// const handleRequestError = (error) => {
//   console.error("Request Error:", error.message);

//   if (error.code === "ECONNABORTED") {
//     return Promise.reject({
//       status: 408,
//       message: "Request timed out. Please try again.",
//     });
//   }

//   return Promise.reject({
//     status: error.response?.status || 500,
//     message: error.message || "An error occurred while making the request.",
//   });
// };

// // Composable error handling for responses
// const handleResponseError = (error) => {
//   const { response } = error;
//   const { addError } = useErrorsStore();

//   if (!response) {
//     return Promise.reject({
//       status: 503,
//       message: "Network error: Unable to reach the server.",
//     });
//   }

//   const errorDetails = {
//     status: response.status,
//     message: response.data?.message || "An error occurred.",
//     errors: response.data?.errors,
//     code: response.data?.code,
//     data: response.data,
//   };

//   switch (response.status) {
//     case 400:
//       errorDetails.message =
//         response.data?.message || "Bad request. Please check your input.";
//       errorDetails.errors = response.data?.errors;

//       break;
//     case 401:
//       errorDetails.message = "Unauthorized. Please log in again.";
//       // Optionally trigger logout or refresh token logic
//       break;
//     case 403:
//       errorDetails.message =
//         "Forbidden. You do not have permission to access this resource.";
//       break;
//     case 404:
//       errorDetails.message = "Resource not found.";
//       break;
//     case 422:
//       errorDetails.message =
//         response.data?.message || "Validation error. Please check your input.";
//       errorDetails.errors = response.data?.errors;
//       addError(errorDetails.errors);
//       break;
//     case 429:
//       errorDetails.message = "Too many requests. Please try again later.";
//       break;
//     case 500:
//       errorDetails.message = "Server error. Please try again later.";
//       break;
//     default:
//       errorDetails.message =
//         response.data?.message || "An unexpected error occurred.";
//   }

//   return Promise.reject(errorDetails);
// };

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Add authorization token if available
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => handleRequestError(error)
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => handleResponseError(error)
// );

// // Composable API call wrapper
// const apiCall = async ({ method, url, data = null, config = {} }) => {
//   try {
//     const response = await axiosInstance({
//       method,
//       url,
//       data,
//       ...config,
//     });
//     return response.data;
//   } catch (error) {
//     throw error; // Error already formatted by interceptors
//   }
// };

// // Export composable methods
// export const useApi = () => ({
//   get: (url, config) => apiCall({ method: "get", url, config }),
//   post: (url, data, config) => apiCall({ method: "post", url, data, config }),
//   put: (url, data, config) => apiCall({ method: "put", url, data, config }),
//   delete: (url, config) => apiCall({ method: "delete", url, config }),
//   patch: (url, data, config) => apiCall({ method: "patch", url, data, config }),
// });

// // Export the Axios instance for custom requests
// export default axiosInstance;

import axios from "axios";
import { useErrorsStore } from "./stores/errors";
import { useAuthStore } from "./stores/auth";
const apiClient = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1", //https://fakestoreapi.in/api // Replace with your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    // Add authentication token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Composable error handling for responses
const handleResponseError = (error) => {
  const { response } = error;
  const { setErrors } = useErrorsStore();

  if (!response) {
    return Promise.reject({
      status: 503,
      message: "Network error: Unable to reach the server.",
    });
  }

  const errorDetails = {
    status: response.status,
    message: response.data?.message || "An error occurred.",
    errors: response.data?.errors,
    code: response.data?.code,
    data: response.data,
  };

  switch (response.status) {
    case 400:
      errorDetails.message =
        response.data?.message || "Bad request. Please check your input.";
      errorDetails.errors = response.data?.errors;

      break;
    case 401:
      errorDetails.message = "Unauthorized. Please log in again.";
      // Optionally trigger logout or refresh token logic
      break;
    case 403:
      errorDetails.message =
        "Forbidden. You do not have permission to access this resource.";
      break;
    case 404:
      errorDetails.message = "Resource not found.";
      break;
    case 422:
      errorDetails.message =
        response.data?.message || "Validation error. Please check your input.";
      errorDetails.errors = response.data?.errors;
      setErrors(errorDetails.errors);
      break;
    case 429:
      errorDetails.message = "Too many requests. Please try again later.";
      break;
    case 500:
      errorDetails.message = "Server error. Please try again later.";
      break;
    default:
      errorDetails.message =
        response.data?.message || "An unexpected error occurred.";
  }

  return Promise.reject(errorDetails);
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => handleResponseError(error)
  // (error) => {
  //   // Handle errors globally
  //   if (error.response) {
  //     switch (error.response.status) {
  //       case 401:
  //         // Handle unauthorized access (e.g., redirect to login)
  //         console.error("Unauthorized request");
  //         break;
  //       case 404:
  //         console.error("Resource not found");
  //         break;
  //       default:
  //         console.error("An error occurred:", error.response.data);
  //     }
  //   }
  //   return Promise.reject(error);
  // }
);

export default apiClient;
