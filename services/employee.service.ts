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
  status: string

}

export const getListEmployee = async ({ size, page, name, status, department }: QueryDataGet) => {
  const response = await axiosInstance.get(
    `user/search?page=${page}&size=${size}&name=${name}&status=${status}&department=${department}`
  )

  return response.data
}
