import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { themeAdminConfig as themeConfig } from '../theme.config';

const defaultState = {
    isDarkMode: false,
    mainLayout: 'app',
    theme: 'light',
    menu: 'vertical',
    layout: 'full',
    rtlClass: 'ltr',
    animation: '',
    navbar: 'navbar-sticky',
    locale: 'en',
    sidebar: false,
    pageTitle: '',
    languageList: [
        { code: 'vn', name: 'Vietnamese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
    ],
    semidark: false,
};

const initialState = {
    theme: localStorage.getItem('admin-theme') || themeConfig.theme,
    menu: localStorage.getItem('admin-menu') || themeConfig.menu,
    layout: localStorage.getItem('admin-layout') || themeConfig.layout,
    rtlClass: localStorage.getItem('admin-rtlClass') || themeConfig.rtlClass,
    animation: localStorage.getItem('admin-animation') || themeConfig.animation,
    navbar: localStorage.getItem('admin-navbar') || themeConfig.navbar,
    locale: localStorage.getItem('admin-i18nextLng') || 'vn',
    isDarkMode: false,
    sidebar: localStorage.getItem('admin-sidebar') || defaultState.sidebar,
    semidark: localStorage.getItem('admin-semidark') || themeConfig.semidark,
    languageList: [
        { code: 'vn', name: 'Vietnamese' },
        { code: 'en', name: 'English' },
        // { code: 'zh', name: 'Chinese' },
        // { code: 'da', name: 'Danish' },
        // { code: 'fr', name: 'French' },
        // { code: 'de', name: 'German' },
        // { code: 'el', name: 'Greek' },
        // { code: 'hu', name: 'Hungarian' },
        // { code: 'it', name: 'Italian' },
        // { code: 'ja', name: 'Japanese' },
        // { code: 'pl', name: 'Polish' },
        // { code: 'pt', name: 'Portuguese' },
        // { code: 'ru', name: 'Russian' },
        // { code: 'es', name: 'Spanish' },
        // { code: 'sv', name: 'Swedish' },
        // { code: 'tr', name: 'Turkish' },
    ],
};

const themeAdminConfigSlice = createSlice({
    name: 'adminAuth',
    initialState: initialState,
    reducers: {
        toggleTheme(state, { payload }) {
            payload = payload || state.theme; // light | dark | system
            localStorage.setItem('admin-theme', payload);
            state.theme = payload;
            if (payload === 'light') {
                state.isDarkMode = false;
            } else if (payload === 'dark') {
                state.isDarkMode = true;
            } else if (payload === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    state.isDarkMode = true;
                } else {
                    state.isDarkMode = false;
                }
            }

            if (state.isDarkMode) {
                document.querySelector('body')?.classList.add('dark');
            } else {
                document.querySelector('body')?.classList.remove('dark');
            }
        },
        toggleMenu(state, { payload }) {
            payload = payload || state.menu; // vertical, collapsible-vertical, horizontal
            state.sidebar = false; // reset sidebar state
            localStorage.setItem('admin-menu', payload);
            state.menu = payload;
        },
        toggleLayout(state, { payload }) {
            payload = payload || state.layout; // full, boxed-layout
            localStorage.setItem('admin-layout', payload);
            state.layout = payload;
        },
        toggleRTL(state, { payload }) {
            payload = payload || state.rtlClass; // rtl, ltr
            localStorage.setItem('admin-rtlClass', payload);
            state.rtlClass = payload;
            document.querySelector('html')?.setAttribute('dir', state.rtlClass || 'ltr');
        },
        toggleAnimation(state, { payload }) {
            payload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
            payload = payload?.trim();
            localStorage.setItem('admin-animation', payload);
            state.animation = payload;
        },
        toggleNavbar(state, { payload }) {
            payload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
            localStorage.setItem('admin-navbar', payload);
            state.navbar = payload;
        },
        toggleSemidark(state, { payload }) {
            payload = payload === true || payload === 'true' ? true : false;
            localStorage.setItem('admin-semidark', payload);
            state.semidark = payload;
        },
        toggleLocale(state, { payload }) {
            payload = payload || state.locale;
            // localStorage.setItem('admin-i18nextLng', payload);
            // i18next.changeLanguage(payload);
            state.locale = payload;
        },
        toggleSidebar(state) {
            state.sidebar = !state.sidebar;
        },

        setPageTitle(state, { payload }) {
            document.title = `${payload}` || 'Manage system ';
        },
    },
});

export const { toggleTheme, toggleMenu, toggleLayout, toggleRTL, toggleAnimation, toggleNavbar, toggleSemidark, toggleLocale, toggleSidebar, setPageTitle } = themeAdminConfigSlice.actions;

export default themeAdminConfigSlice.reducer;
