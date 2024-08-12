import axiosInstance from "@/config/axiosConfig";

type RequestQuery = {
  page: number;
  size: number;
  title: string;
};
export const getContractType = async ({ page, size, title }: RequestQuery) => {
  const result = await axiosInstance.get(
    `contract-type?page=${page}&size=${size}&title=${title}`
  );
  return result?.data;
};
