import axiosClient, { axiosClientPrivate } from './axiosClient';
const url = '/auth';
const authService = {
    login: (data: any) => axiosClient.post(`${url}/login`, data),
    signUp: (data: any) => axiosClient.post(`${url}/sign-up`, data),
    getUserInfo: () => {
        return axiosClient.get(url + '/info');
    },
    loginAdmin: (data: any) => axiosClient.post(`${url}/login/admin`, data),
    forgotPassword: (data: any) => axiosClient.post(`${url}/forgot-password`, data),
    verifyForgotPassword: (data: any) => axiosClient.post(`${url}/verify-password`, data),
    passwordReset: (data: any) => axiosClient.post(`${url}/password-reset`, data),
    refreshToken: () => axiosClient.post(`${url}/refreshToken`),
    logout: () => axiosClient.post(`${url}/logout`),
};

export const { logout, refreshToken, verifyForgotPassword, passwordReset, forgotPassword, loginAdmin, getUserInfo, login, signUp } = authService;
