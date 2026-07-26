'use client';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export interface LoginResponse {
  ok: boolean;
  code: string;
  data?: LoginResponseData | null;
}
