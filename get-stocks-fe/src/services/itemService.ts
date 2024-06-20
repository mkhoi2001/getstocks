import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/item';

const itemService = {
    downloadItemTypeG: (data: any) => axiosClientPrivate.post(`${url}/down-item/g`, data),
    downloadItemTypeP: (data: any) => axiosClientPrivate.post(`${url}/down-item/p`, data),
    getItemHistoryByUserId: () => axiosClientPrivate.get(`${url}/history`),
    getAllItemHistory: () => axiosClientPrivate.get(`${url}/history/all`),
    getItemHistoryListByUserId: (id: string = '') => axiosClientPrivate.get(`${url}/history/${id}`),
    reDownloadItem: (id: string = '') => axiosClientPrivate.post(`${url}/redown-item/${id}`),
};

export const { getAllItemHistory, downloadItemTypeG, getItemHistoryListByUserId, downloadItemTypeP, getItemHistoryByUserId, reDownloadItem } = itemService;
