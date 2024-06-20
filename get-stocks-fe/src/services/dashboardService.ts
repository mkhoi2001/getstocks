import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/dashboard';

const dashboardService = {
    getNewsOrderHistory: () => axiosClientPrivate.get(`${url}/news/order`),
    getNewsItemHistory: () => axiosClientPrivate.get(`${url}/news/item`),
    getNewsOrderHistoryOwn: () => axiosClientPrivate.get(`${url}/news/order/own`),
    getNewsItemHistoryOwn: () => axiosClientPrivate.get(`${url}/news/item/own`),
    getOverviewUser: () => axiosClientPrivate.get(`${url}/user`),
    getOverviewItemDownload: () => axiosClientPrivate.get(`${url}/item-down`),
    getOverviewOrder: () => axiosClientPrivate.get(`${url}/order`),
    getAllOrverview: () => axiosClientPrivate.get(`${url}/overview/all`),
    getUsersByMonthAndYear: (year: number = new Date().getFullYear()) => axiosClientPrivate.get(`${url}/user/${year}`),
    getOrdersByMonthAndYear: (year: number = new Date().getFullYear()) => axiosClientPrivate.get(`${url}/order/${year}`),
    getItemsByMonthAndYear: (year: number = new Date().getFullYear()) => axiosClientPrivate.get(`${url}/item/${year}`),
    getUsersByFilterDate: (data: any) => axiosClientPrivate.get(`${url}/date/user?from=${data.fromDate}&to=${data.toDate}`),
    getItemsByFilterDate: (data: any) => axiosClientPrivate.get(`${url}/date/item?from=${data.fromDate}&to=${data.toDate}`),
    getOrdersByFilterDate: (data: any) => axiosClientPrivate.get(`${url}/date/order?from=${data.fromDate}&to=${data.toDate}`),
};

export const {
    getNewsOrderHistoryOwn,
    getNewsItemHistoryOwn,
    getNewsOrderHistory,
    getNewsItemHistory,
    getItemsByFilterDate,
    getOrdersByFilterDate,
    getUsersByFilterDate,
    getUsersByMonthAndYear,
    getOrdersByMonthAndYear,
    getItemsByMonthAndYear,
    getAllOrverview,
    getOverviewOrder,
    getOverviewUser,
    getOverviewItemDownload,
} = dashboardService;
