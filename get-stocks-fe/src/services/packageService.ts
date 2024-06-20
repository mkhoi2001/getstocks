import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/packages';

const LIMIT_SIZE = 10;

const packageService = {
    getAllPackageG: () => axiosClientPrivate.get(`${url}/g`),
    getPacakgeGById: (id: string = '') => axiosClientPrivate.get(`${url}/g/${id}`),
    createPackageG: (data: any) => axiosClientPrivate.post(`${url}/g`, data),
    updatePackageG: (data: any) => axiosClientPrivate.patch(`${url}/g/${data?.id}`, data),
    deletePackageG: (id: string) => axiosClientPrivate.delete(`${url}/g/${id}`),
    getAllPackageP: () => axiosClientPrivate.get(`${url}/p`),
    getPacakgePById: (id: string = '') => axiosClientPrivate.get(`${url}/p/${id}`),
    createPackageP: (data: any) => axiosClientPrivate.post(`${url}/p`, data),
    updatePackageP: (data: any) => axiosClientPrivate.patch(`${url}/p/${data?.id}`, data),
    deletePackageP: (id: string) => axiosClientPrivate.delete(`${url}/p/${id}`),
};

export const { getAllPackageP, getPacakgePById, createPackageP, updatePackageP, deletePackageP, getAllPackageG, getPacakgeGById, createPackageG, updatePackageG, deletePackageG } = packageService;
