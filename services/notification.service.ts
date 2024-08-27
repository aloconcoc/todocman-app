import axiosInstance from "@/config/axiosConfig";

export const getNotification = async (page: number) => {
  const response = await axiosInstance.get(`notification?page=${page}&size=10`);
  return response?.data;
};
export const getUnreadNotification = async () => {
  const response = await axiosInstance.get(`notification/unread`);
  return response?.data;
};
export const getNumberUnreadNotify = async () => {
  const response = await axiosInstance.get(`notification/unread`);
  return response.data;
};
export const readNotify = async (id: string) => {
  const response = await axiosInstance.put(`notification/${id}/true`);
  return response.data;
};
export const deleteNotify = async (id: string) => {
  const response = await axiosInstance.delete(`notification/${id}`);
  return response.data;
};

export const getNotificationByAppenId = async (id: string) => {
  const response = await axiosInstance.get(
    `api/contract-appendices/user/${id}`
  );
  return response?.data;
};
