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
interface BookingData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  serviceDetails: string;
  totalAmount: number;
  bookingType: string;
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

export const sendBookingConfirmation = async (bookingData: BookingData): Promise<ApiResponse> => {
  try {
    console.log('Sending booking confirmation with data:', bookingData);
    
    const response = await axios.post<ApiResponse>(`${API_URL}/booking-confirmation`, bookingData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ApiError;
  }
};