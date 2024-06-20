import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';
import { StockConfig } from '../types/system';

const url = '/config';

const systemConfigService = {
    getConfigClient: () => axiosClient.get(`${url}/client`),
    getConfigAdmin: () => axiosClient.get(`${url}/admin`),
    getSystemDataByKey: (key: string) => axiosClientPrivate.get(`${url}/k?key=${key}`),
    getAllSystemConfig: () => axiosClientPrivate.get(`${url}`),
    changeValueById: (data: any) => axiosClientPrivate.patch(`${url}/${data?.id}`, data),
    changeValueByKey: (data: any) => axiosClientPrivate.patch(`${url}/k`, data),
    updateShowStockKey: (data: StockConfig) => axiosClientPrivate.patch(`${url}/stock`, data),
    updateGetStockProv: (data: any) => axiosClientPrivate.patch(`${url}/gsprov`, data),
    changeMultipleValue: (data: any) => axiosClientPrivate.patch(`${url}`, data),
};

export const { updateGetStockProv, changeMultipleValue, updateShowStockKey, getSystemDataByKey, getConfigAdmin, getConfigClient, getAllSystemConfig, changeValueById, changeValueByKey } =
    systemConfigService;
