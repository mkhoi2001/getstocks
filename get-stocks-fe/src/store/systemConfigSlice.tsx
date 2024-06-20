import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
import themeConfig from '../theme.config';

const defaultState = {
    footer: '',
    ul: '',
    facebook: '',
    zalo: '',
    skype: '',
    app_name: '',
};

const initialState = {
    footer: '',
    ul: '',
    facebook: '',
    zalo: '',
    skype: '',
    app_name: '',
    telegram: '',
    botsms_content: '',
    banner: '',
    usd_vnd: '',
    guide_box: '',
    client_id_paypal: '',
    show_paypal: '',
    show_stock: '',
};

const systemConfigSlice = createSlice({
    name: 'systemConfig',
    initialState: initialState,
    reducers: {
        setConfig: (state, { payload }) => {
            if (Object.keys(state).includes(payload?.key)) {
                const key: 'client_id_paypal' | 'guide_box' | 'usd_vnd' | 'footer' | 'banner' | 'ul' | 'skype' | 'zalo' | 'app_name' | 'telegram' | 'botsms_content' = payload.key;
                state[key] = payload.value;

                if (key == 'app_name') {
                    document.title = payload.key;
                }
            }
        },
        setConfigs: (state, { payload }) => {
            if (payload?.length) {
                payload.forEach((item: any) => {
                    if (Object.keys(state).includes(item?.key)) {
                        const key: 'client_id_paypal' | 'guide_box' | 'usd_vnd' | 'footer' | 'banner' | 'ul' | 'skype' | 'zalo' | 'app_name' | 'telegram' | 'botsms_content' = item.key;
                        state[key] = item.value;
                    }
                });

                document.title = state.app_name;
            }
        },
    },
});

export const { setConfig, setConfigs } = systemConfigSlice.actions;

export default systemConfigSlice.reducer;
