import { axiosInstant } from "@/config/axiosConfig";

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginRequest) => {
  try {
    console.log({ email, password });

    const response = await axiosInstant.post("public/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
