'use client';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: UserRole;
  bankCode?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
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
