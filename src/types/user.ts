export type UserRole = "admin" | "tim_k3" | "kepala_unit" | "pegawai";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  unit: string;
  nip: string;
  avatar?: string;
  createdAt: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}
