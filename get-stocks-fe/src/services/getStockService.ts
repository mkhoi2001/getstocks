import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/sys/stocks';

const getStockService = {
    getNewAccessToken: (id: string) => axiosClientPrivate.get(`${url}/${id}/token`),
    getBalance: (id: string) => axiosClientPrivate.get(`${url}/${id}/balance`),
    getProviders: (id: string = '') => axiosClientPrivate.get(`${url}/${id}/providers`),
    getOrders: (id: string = '') => axiosClientPrivate.get(`${url}/${id}/orders`),
};

export const { getNewAccessToken, getBalance, getProviders, getOrders } = getStockService;
