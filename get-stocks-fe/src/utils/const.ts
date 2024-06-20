import { AppRoutes, AdminRoutes } from '../router/routes';

export const defaultRoute = {
    ADMIN: AdminRoutes.DASHBOARD_ADMIN,
    USER: AppRoutes.DASHBOARD_USER,
};

export enum FormType {
    INFO = 'INFO',
    EDIT = 'EDIT',
}

export const SHOW_PAYPAL = {
    OPEN: `1`,
    CLOSE: `0`,
};

export const PAYPAL_KEY = 'show_paypal';
export const SHOW_STOCK = 'show_stock';
export const GETSTOCKSTYPE = 'getstock_prov';
export const CURRENCY = 'usd_vnd';

export const ENV_CONFIG = {
    //VITE_REACT_APP_API_URL: import.meta.env.VITE_REACT_APP_API_URL || 'https://server.vsm.vn',
    //VITE_REACT_APP_API_URL_VERSION: import.meta.env.VITE_REACT_APP_API_URL_VERSION || 'https://server.vsm.vn/api/v1',
    VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV || 'prod',
    VITE_REACT_APP_API_URL: 'https://server.vsm.vn',
    VITE_REACT_APP_API_URL_VERSION: 'https://server.vsm.vn/api/v1',
    // VITE_NODE_ENV: 'prod',
};
