import { ApiResponse, request } from "@/lib/axios";
import * as Types from "./AuthApi.types";

const login = async (
  data: Types.TLoginRequest
): Promise<ApiResponse<Types.TLoginResponse>> => {
  return await request.post<Types.TLoginResponse>("auth/signin", data);
};

const getCurrentUser = async (): Promise<ApiResponse<Types.TUserProfile>> => {
  return await request.get<Types.TUserProfile>("user/me");
};

export const authApi = { login, getCurrentUser };
