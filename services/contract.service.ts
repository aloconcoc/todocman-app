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
  console.log("fdm", formData);
  const response = await axiosInstanceFormData.post(`old-contract`, formData);
  return response.data;
};

export const deleteOldContract = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`old-contract/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getNewContract = async (
  page: number,
  size: number,
  statusContract: string
) => {
  const response = await axiosInstance.get(
    `contract/${page}/${size}?status=${statusContract}`
  );
  return response.data;
};

export const signContract = async (data: any) => {
  // console.log("data1", data);

  const response = await axiosInstance.post(
    `contract/public/sign-contract`,
    data
  );
  return response.data;
};

export const sendMailPublic = async (formData: any) => {
  console.log("form", formData);

  const response = await axiosInstanceFormData.post(
    `contract/public/send-mail`,
    formData
  );
  return response.data;
};

export const sendMail = async (formData: any) => {
  const response = await axiosInstanceFormData.post(
    `contract/send-mail`,
    formData
  );
  return response.data;
};

export const getNewContractByIdNotToken = async (id: any) => {
  const response = await axiosInstance.get(
    `contract/public/sign-contract/${id}`
  );
  return response.data;
};

export const deleteContract = async (id: string) => {
  const response = await axiosInstance.delete(`contract/${id}`);
  return response.data;
};
export const getNewContractById = async (id: any) => {
  const response = await axiosInstance.get(`contract/${id}`);
  return response.data;
};

export const getSearchContract = async ({ fieldSearch, data }: any) => {
  const response = await axiosInstance.post(`${fieldSearch}/search`, data);
  return response.data;
};
