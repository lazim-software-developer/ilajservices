import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
console.log('API_URL:', API_URL);

interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

interface ApiError {
  error: string;
}

export const sendEmail = async (emailData: EmailData): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${API_URL}/contact-us`, emailData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ApiError;
  }
};