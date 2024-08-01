import axiosInstance from "@/config/axiosConfig";

interface QueryDataGet {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  position?: string;
  department?: string;
  permissions?: string[];
  page?: number;
  size?: number;
}

export const getListEmployee = async ({ size, page, name }: QueryDataGet) => {
  const response = await axiosInstance.get(
    `user/search?page=${page}&size=${size}&name=${name}&status=ACTIVE`
  );
  return response.data;
};
