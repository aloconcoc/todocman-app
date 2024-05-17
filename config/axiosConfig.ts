import { BASE_URL } from "@/constants";
import axios from "axios";
import { getToken } from "./tokenUser";
export const axiosInstant = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
  });

  axios.interceptors.request.use(function (config) {
    
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
   
    return Promise.reject(error);
  });
  axios.interceptors.response.use(function (response) {
    
    return response;
  }, function (error) {
    
    return Promise.reject(error);
  });