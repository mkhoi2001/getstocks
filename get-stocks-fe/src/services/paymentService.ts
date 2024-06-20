import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/orders';

const paymentService = {
    getAllOrderHistoryByUserId: (id: string = '') => axiosClientPrivate.get(`${url}/${id}`),
    getAllOrderHistoryByOwn: () => axiosClientPrivate.get(`${url}`),
    getPackageOrderByUserId: () => axiosClientPrivate.get(`${url}/package`),
    createOrderHistory: (data: any) => axiosClientPrivate.post(`${url}`, data),
    orderSuccess: (id: string = '') => axiosClientPrivate.patch(`${url}/${id}/success`),
    orderFail: (data: any) => axiosClientPrivate.patch(`${url}/${data.id}/fail`, data),
    getAllOrderHistory: () => axiosClientPrivate.get(`${url}/all`),
    createOrderByPaypal: (data: any) => axiosClientPrivate.post(`${url}/paypal`, data),
};

export const { createOrderByPaypal, getAllOrderHistoryByOwn, getAllOrderHistory, getPackageOrderByUserId, getAllOrderHistoryByUserId, createOrderHistory, orderSuccess, orderFail } = paymentService;
