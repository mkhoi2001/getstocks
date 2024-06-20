import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/bank';

const bankService = {
    getAllBanks: () => axiosClientPrivate.get(`${url}`),
    getAllActiveBanks: () => axiosClientPrivate.get(`${url}/active`),
    getBankById: (id: string = '') => axiosClientPrivate.get(`${url}/${id}`),
    updateBank: (data: any) => axiosClientPrivate.patch(`${url}/${data?.id}`, data),
    changeBankStatus: (id: string = '') => axiosClientPrivate.patch(`${url}/${id}/status`),
};

export const { getAllActiveBanks, getAllBanks, getBankById, updateBank, changeBankStatus } = bankService;
