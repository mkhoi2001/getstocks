import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/stocks';

const LIMIT_SIZE = 10;

const stockService = {
    getAllStocks: () => axiosClientPrivate.get(`${url}/all`),
    getAllActiveStockTypeG: () => axiosClientPrivate.get(`${url}/get-all/g`),
    getAllStockTypeG: () => axiosClientPrivate.get(`${url}/all/g`),
    getAllStockTypeP: () => axiosClientPrivate.get(`${url}/all/p`),
    getAllActiveStockTypeP: () => axiosClientPrivate.get(`${url}/get-all/p`),
    getStockById: (id: string = '') => axiosClientPrivate.get(`${url}/${id}`),
    getAllActiveStocks: () => axiosClientPrivate.get(`${url}/get-all`),
    createStock: (data: any) => {
        return axiosClientPrivate.post(`${url}`, data);
    },
    updateStock: (data: any) => axiosClientPrivate.patch(`${url}/${data.id}`, data),
    changeStockStatus: (id: string = '') => axiosClientPrivate.patch(`${url}/${id}/status`),
    deleteStock: (id: string = '') => axiosClientPrivate.delete(`${url}/${id}`),
    getAllGetStockItems: () => axiosClientPrivate.get(`${url}/getstock/all`),
    updateGetStockItemStatus: (data: any) => axiosClientPrivate.patch(`${url}/getstock/status`, data),
    getStockProviderById: (id: string) => axiosClientPrivate.get(`${url}/getstockprov/${id}`),
    changeTypePackProvider: (data: any) => axiosClientPrivate.patch(`${url}/getstockprov/typePack`, data),
};

export const {
    getAllStockTypeG,
    getAllStockTypeP,
    getAllActiveStockTypeP,
    getAllActiveStockTypeG,
    deleteStock,
    changeStockStatus,
    getAllActiveStocks,
    getAllStocks,
    createStock,
    getStockById,
    updateStock,
    getAllGetStockItems,
    updateGetStockItemStatus,
    getStockProviderById,
    changeTypePackProvider,
} = stockService;
