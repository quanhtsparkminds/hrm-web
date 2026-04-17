import { ApiResponse, request } from '@/lib/axios';
import * as Types from './AuthApi.types';

const login = async (data: Types.TLoginRequest): Promise<ApiResponse<Types.TLoginResponse>> => {
  return await request.post<Types.TLoginResponse>('auth/signin', data);
};

const getCurrentUser = async (): Promise<ApiResponse<Types.TUserProfile>> => {
  return await request.get<Types.TUserProfile>('user/me');
};

const signup = async (data: Types.TSignupRequest): Promise<ApiResponse<null>> => {
  return await request.post<null>('auth/signup', data);
};

const checkSession = async (): Promise<ApiResponse<{ email: string; authenticated: boolean }>> => {
  return await request.get<{ email: string; authenticated: boolean }>('auth/check-session');
};

export const authApi = { login, getCurrentUser, signup, checkSession };
