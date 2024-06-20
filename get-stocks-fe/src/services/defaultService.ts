import axiosClient, { axiosClientPrivate } from './axiosClient';
import { generateParamsString } from '../utils/generateParamsString';

const url = '/default';

const defaultService = {
    getDefaultDataByType: (type: string = '') => axiosClientPrivate.get(`${url}/${type}`),
};

export const { getDefaultDataByType } = defaultService;
