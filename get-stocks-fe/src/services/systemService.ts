import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/system';

const LIMIT_SIZE = 10;

const systemService = {
    getAllSystems: () => axiosClientPrivate.get(`${url}`),
    getSystemById: (id: string) => axiosClientPrivate.get(`${url}/${id}`),
    updateSystem: (data: any) => axiosClientPrivate.patch(`${url}/${data.id}`, data),
    getGetstockBalance: () => axiosClientPrivate.get(`${url}/getstocks/balance`),
};

export const { getGetstockBalance, getSystemById, updateSystem, getAllSystems } = systemService;
