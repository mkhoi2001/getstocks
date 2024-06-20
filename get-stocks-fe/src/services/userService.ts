import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';
import { User, DataAmount } from '../types/user';
const url = '/users';

const LIMIT_SIZE = 10;

const userService = {
    getUsers: ({ page = 0, limit = LIMIT_SIZE, sort = 'id', direction = 'asc' }: Pagination) => {
        const paramsString = generateParamsString({ page, limit, sort, direction });

        return axiosClientPrivate.get(`${url}?${paramsString}`);
    },
    getAllUsers: () => axiosClientPrivate.get(`${url}/all`),
    getOverviewItemByUserId: () => axiosClientPrivate.get(`${url}/overview/item`),
    getOverviewOrderByUserId: () => axiosClientPrivate.get(`${url}/overview/order`),
    getUserById: (id: string = '') => axiosClientPrivate.get(`${url}/${id}`),
    updateUserInfo: (data: User) => axiosClientPrivate.patch(`${url}/${data.id}`, data),
    updateProfile: (data: User) => axiosClientPrivate.patch(`${url}`, data),
    plusBalance: (data: DataAmount[], id: string) => axiosClientPrivate.patch(`${url}/${id}/plus`, data),
    minusBalance: (data: DataAmount[], id: string) => axiosClientPrivate.patch(`${url}/${id}/minus`, data),
    changePassword: (data: any) => axiosClientPrivate.patch(`${url}/change-password`, data),
    resetPassword: (data: { id: string; password: string }) => axiosClientPrivate.patch(`${url}/reset-password/${data.id}`, data),
    changeUserStatus: (id: string) => axiosClientPrivate.patch(`${url}/status/${id}`),
};

export const {
    getOverviewItemByUserId,
    getOverviewOrderByUserId,
    changePassword,
    changeUserStatus,
    resetPassword,
    getUsers,
    getAllUsers,
    getUserById,
    updateProfile,
    updateUserInfo,
    plusBalance,
    minusBalance,
} = userService;
