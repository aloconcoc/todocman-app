import axiosInstance, { axiosInstanceFormData } from "@/config/axiosConfig";

export const getOldContract = async (page: number, size: number) => {
  try {
    const response = await axiosInstance.get(
      `old-contract?page=${page}&size=${size}`
    );
    // console.log("response O", response.data);

    return response.data;
  } catch (error) {
    console.log("o error", error);
  }
};

export const createOldContract = async (formData: any) => {
  try {
    const response = await axiosInstanceFormData.post(
      `old-contract/mobile`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOldContract = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`old-contract/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getNewContract = async (page: number, size: number) => {
  const response = await axiosInstance.get(`contract/${page}/${size}`);
  return response.data;
};
