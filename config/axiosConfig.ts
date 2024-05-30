import { BASE_URL, NOT_FOUND, UNAUTHORIZED } from "@/constants";
import axios from "axios";
import { getToken, removeToken } from "./tokenUser";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceFormData = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Thiết lập interceptors cho axiosInstance

axiosInstance.interceptors.request.use(
  async function (config) {
    const token = await getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Thiết lập interceptors cho axiosInstanceFormData

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    switch (error?.response?.status) {
      case UNAUTHORIZED:
        removeToken();
        window.location.href = "/login";
        break;
      case NOT_FOUND:
        window.location.href = "/not-found";
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

axiosInstanceFormData.interceptors.request.use(
  async function (config) {
    const token = await getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Thiết lập interceptors cho axiosInstanceFormData

axiosInstanceFormData.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    switch (error?.response?.status) {
      case UNAUTHORIZED:
        removeToken();
        window.location.href = "/login";
        break;
      case NOT_FOUND:
        window.location.href = "/not-found";
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
