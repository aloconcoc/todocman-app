import axiosInstance, { axiosInstanceFormData } from "@/config/axiosConfig";

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginRequest) => {
  try {
    console.log({ email, password });

    const response = await axiosInstance.post("public/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getProfile = async (id: any) => {
  try {
    const response = await axiosInstance.get(`user/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (id: string, formData: any) => {
  const response = await axiosInstanceFormData.put(`user/${id}`, formData);
  return response.data;
};
