import axiosInstance from "@/config/axiosConfig";

export const getContractType = async ({ page, size }: any) => {
  const result = await axiosInstance.get(
    `contract-type?page=${page}&size=${size}`
  );
  return result?.data;
};
