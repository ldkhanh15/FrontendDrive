import { Mutex } from "async-mutex";
import axiosClient from "axios";
import { notification } from "antd";

// Tạo axios instance
const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

// Hàm làm mới token
const handleRefreshToken = async () => {
    return await mutex.runExclusive(async () => {
        try {
            const res = await instance.get('/api/v1/auth/refresh');
            if (res && res.data) {
                console.log("Token refreshed successfully");
                return res.data.access_token;
            } else {
                console.log("Failed to refresh token");
                return null;
            }
        } catch (error) {
            console.error("Error during refresh token request", error);
            return null;
        }
    });
};

// Interceptor cho request
instance.interceptors.request.use(function (config) {
    const accessToken = window.localStorage.getItem('access_token');

    // Không thêm Authorization header nếu là yêu cầu làm mới token
    if (config.url !== '/api/v1/auth/refresh' && accessToken && config.url !== '/api/v1/auth/login') {
        config.headers.Authorization = 'Bearer ' + accessToken;
    }

    if (!config.headers.Accept) {
        config.headers.Accept = "application/json";
        config.headers["Content-Type"] = "application/json; charset=utf-8";
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Interceptor cho response
instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        const originalRequest = error.config;
        console.log("Error response status:", error.response.status);

        // Kiểm tra lỗi 401 và không phải từ endpoint login
        if (error.response.status === 401 && originalRequest.url !== '/api/v1/auth/login' && !originalRequest.headers[NO_RETRY_HEADER]) {
            console.log("Token expired, attempting to refresh token");
            const accessToken = await handleRefreshToken();
            originalRequest.headers[NO_RETRY_HEADER] = 'true';
            if (accessToken) {
                window.localStorage.setItem('access_token', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return instance(originalRequest);
            }
        }

        // Xử lý lỗi 400 từ endpoint refresh
        if (error.response.status === 400 && originalRequest.url === '/api/v1/auth/refresh') {
            const message = error?.response?.data?.error ?? "Có lỗi xảy ra, vui lòng đăng nhập lại.";
            notification.error({
                description: "Lỗi làm mới token",
                message: message
            });

        }
        if (error.response.status === 400 && originalRequest.url !== '/api/v1/auth/refresh') {
            const message = error?.response?.data?.error ?? "Có lỗi xảy ra!";
            notification.error({
                description: error?.response?.data?.message ?? "Bad request",
                message: message
            });

        }
        // Xử lý lỗi 403
        if (error.response.status === 403) {
            notification.error({
                description: error?.response?.data?.message ?? "Truy cập bị từ chối",
                message: error?.response?.data?.error ?? ""
            });
        }
        if (error.response.status === 500) {
            notification.error({
                description: error?.response?.data?.message ?? "Error from server",
                message: error?.response?.data?.error ?? ""
            });
        }
        return Promise.reject(error);
    }
);

export default instance;
