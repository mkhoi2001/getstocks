import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/momo';

const momoService = {
    getMomoById: (id: string = '') => axiosClientPrivate.get(`${url}/${id}`),
    updateMomo: (data: any) => axiosClientPrivate.patch(`${url}/${data?.id}`, data),
    changeMomoStatus: (id: string = '') => axiosClientPrivate.patch(`${url}/${id}/status`),
    getAllMomoActive: () => axiosClientPrivate.get(`${url}/active`),
};

export const { getAllMomoActive, getMomoById, updateMomo, changeMomoStatus } = momoService;
