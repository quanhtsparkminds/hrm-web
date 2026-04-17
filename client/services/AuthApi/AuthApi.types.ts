export interface TSignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface TLoginRequest {
  username: string;
  password: string;
}

export interface TLoginResponse {}

export interface TUserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
  age: number | null;
  name: string;
  department: string;
}
