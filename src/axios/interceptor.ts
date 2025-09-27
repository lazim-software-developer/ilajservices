import axios from 'axios';
// import {GetCookieData,SetCookieData} from "../../Utils/FetchData/CookieUtils";
const baseUrl = import.meta.env.VITE_API_URL || 'https://ilajservices-backend.vercel.app/'; // Fallback to API_URL if baseUrl is not set
const api = axios.create({
  baseURL: baseUrl
});

let isRefreshing = false;
let failedQueue: { resolve: Function, reject: Function }[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(async config => {
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {

        const refresh_token = "";


        if (!refresh_token) {
          processQueue(new Error('No refresh token'), null);
          return Promise.reject(new Error('No refresh token'));
        }

        const res = await axios.post(`${baseUrl}/refresh-token`, {
          refresh_token,
        });

        const { access_token } = res.data;
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (refreshError.response?.status === 401) {

        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
