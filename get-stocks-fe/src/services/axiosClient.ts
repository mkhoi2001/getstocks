import axios from 'axios';
import jwt_decode from 'jwt-decode';
import store from '../store';
import { logout, setAccessToken } from '../store/userSlice';
import toast from 'react-hot-toast';
import { ENV_CONFIG } from '../utils/const';
import { refreshToken } from './authService';

const baseURL = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;
const baseAPI = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;
// console.log('baseURL', baseURL);

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
        'content-type': 'application/json',
    },
    withCredentials: true,
    timeout: 60000, // 60 seconds
});

export const axiosClientPrivate = axios.create({
    baseURL: baseAPI,
    headers: {
        'Content-Type': 'multipart/form-data',
        'content-type': 'application/json',
    },
    timeout: 300000,
    withCredentials: true,
});

axiosClientPrivate.interceptors.request.use(
    async (config) => {
        const accessToken = store.getState().user.data.accessToken;
        const locale = store.getState().themeConfig.locale;

        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers['Accept-Language'] = locale || 'en';
        if (accessToken) {
            const decodeToken: any = await jwt_decode(accessToken);
            const today = new Date();

            if (decodeToken.exp < today.getTime() / 1000) {
                try {
                    const res = await refreshToken();
                    store.dispatch(setAccessToken(res.data.token));
                    config.headers['Authorization'] = `Bearer ${res.data.token}`;
                } catch (error) {
                    store.dispatch(logout());
                }
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error?.response?.data);
    }
);

axiosClientPrivate.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        // console.log('error', error);
        if (error.code === 'ERR_NETWORK') {
            // window.location.href = '/404';
            toast.error('Đã có lỗi xảy ra');
        }
        if (error.response?.status === 401) {
            console.log('not author client');
            store.dispatch(logout());
        }
        // console.log('error axios', error);
        return Promise.reject(error?.response?.data);
    }
);

axiosClient.interceptors.request.use(
    async (config) => {
        const accessToken = store.getState()?.user?.data?.accessToken;
        if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

        const locale = store.getState().themeAdminConfig.locale || store.getState().themeConfig.locale;
        config.headers['Accept-Language'] = locale || 'en';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        if (error?.response?.status === 401) {
            // window.location.href = '/404';
            store.dispatch(logout());
        }
        if (error?.code === 'ERR_NETWORK') {
            toast.error('Đã có lỗi xảy ra');
        }
        // console.log('error axios client', error);

        return Promise.reject(error?.response?.data);
    }
);

export default axiosClient;
