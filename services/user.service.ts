import axiosInstance, { axiosInstanceFormData } from "@/config/axiosConfig";

export type LoginRequest = {
  email: string;
  password: string;
  tokenDevice: string;
};

export const login = async ({ email, password, tokenDevice }: LoginRequest) => {
  try {
    console.log({ email, password, tokenDevice });

    const response = await axiosInstance.post("public/auth/login", {
      email,
      password,
      tokenDevice,
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (email: any) => {
  try {
    console.log("edm", email);

    const response = await axiosInstance.get(
      `public/auth/logout?email=${email}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
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

type UserList = {
  label: string;
  value: string;
};
export const getUserByPermission = async (
  permission: string
): Promise<UserList[]> => {
  const response = await axiosInstance.get(
    `user/searchByPermission?permission=${permission}`
  );
  const result = response.data?.object?.content.map((d: any) => ({
    label: d.email,
    value: d.email,
  }));
  return result as UserList[];
};

export const sendMail = async (formData: any) => {
  const response = await axiosInstanceFormData.post(
    `contract/send-mail`,
    formData
  );
  return response.data;
};
