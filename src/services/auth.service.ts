import axios from 'axios';
import { API_BASE_URL } from '../config/api';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminLogin = async (credentials: LoginCredentials) => {
  const response = await authClient.post<ApiResponse<LoginResponse> | LoginResponse>(
    '/auth/admin/login',
    credentials,
  );

  if ('data' in response.data) {
    return response.data.data;
  }

  return response.data;
};

export const refreshAdminAccessToken = async (params: {
  accessToken: string;
  refreshToken: string;
}) => {
  const response = await authClient.post<ApiResponse<RefreshTokenResponse> | RefreshTokenResponse>(
    '/auth/admin/refresh',
    {
      accessToken: params.accessToken,
    },
    {
      headers: {
        'X-Refresh-Token': params.refreshToken,
      },
    },
  );

  if ('data' in response.data) {
    return response.data.data.accessToken;
  }

  return response.data.accessToken;
};
