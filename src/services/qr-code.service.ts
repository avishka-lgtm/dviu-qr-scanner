import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { QrScanResponse } from '../types/qrCode';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanQrCode = async (encryptedData: string, accessToken: string) => {
  const response = await apiClient.post<QrScanResponse>(
    '/qr-code/scan',
    { encryptedData },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Unable to validate ticket');
  }

  return response.data;
};
