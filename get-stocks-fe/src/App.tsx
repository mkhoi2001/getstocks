import { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from './store';
import { setLang, toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark, setPageTitle } from './store/themeConfigSlice';
import {
    toggleRTL as toggleRTLAdmin,
    toggleTheme as toggleThemeAdmin,
    toggleLocale as toggleLocaleAdmin,
    toggleMenu as toggleMenuAdmin,
    toggleLayout as toggleLayoutAdmin,
    toggleAnimation as toggleAnimationAdmin,
    toggleNavbar as toggleNavbarAdmin,
    toggleSemidark as toggleSemidarkAdmin,
} from './store/themeAdminConfigSlice';
import store from './store';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from './services/authService';
import { updateUserInfo, logout } from './store/userSlice';
import { Toaster, toast } from 'react-hot-toast';
import { CusError } from './types/error';
import { AdminRoutes, changeAppRoutesByLang } from './router/routes';
import { ROLES } from './types/user';
import { useLocation } from 'react-router-dom';
import { getConfigClient } from './services/systemConfigService';
import { setConfigs } from './store/systemConfigSlice';
import i18next from 'i18next';
import { AppLangs } from './router';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function App({ children }: PropsWithChildren) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const themeAdminConfig = useSelector((state: IRootState) => state.themeAdminConfig);
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);
    const { isLogin } = useSelector((state: IRootState) => state.user.data);
    const user = useSelector((state: IRootState) => state.user.data.info);
    const dispatch = useDispatch();
    const location = useLocation();

    useQuery({
        queryKey: ['systemConfig'],
        queryFn: getConfigClient,
        enabled: isLogin,
        onSuccess: (data) => {
            dispatch(setConfigs(data?.data));
        },
    });

    useQuery({
        queryKey: ['user'],
        queryFn: getUserInfo,
        enabled: isLogin,
        onSuccess: (data) => {
            // console.log('user info data', data);
            dispatch(updateUserInfo(data.data));
        },
        onError: (error: CusError) => {
            if (error?.status === 404) {
                dispatch(logout());
            }
        },
    });

    useEffect(() => {
        if (user?.role === ROLES.ADMIN && !window.location.href.includes(AdminRoutes.PREFIX)) {
            i18next.changeLanguage(themeConfig.lang);
        } else if (user?.role === ROLES.ADMIN) {
            i18next.changeLanguage('vn');
        }

        // if (user?.role === ROLES.USER) {
        //     for (const item of AppLangs) {
        //         if (location.pathname.includes(item)) {
        //             i18next.changeLanguage(item);
        //             break;
        //         }
        //     }
        // }
    }, [user]);

    useEffect(() => {
        if (AppLangs.some((item: string) => location.pathname.includes(item))) {
            for (const item of AppLangs) {
                if (location.pathname.includes(`/${item}`)) {
                    i18next.changeLanguage(item);
                    changeAppRoutesByLang(item);
                    break;
                }
            }
        }
    }, [location, user]);

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
        dispatch(setLang(localStorage.getItem('lang') || themeConfig.lang));
        dispatch(setPageTitle('Getfile - Vsm'));
    }, [
        dispatch,
        themeConfig.lang,
        themeConfig.theme,
        themeConfig.menu,
        themeConfig.layout,
        themeConfig.rtlClass,
        themeConfig.animation,
        themeConfig.navbar,
        themeConfig.locale,
        themeConfig.semidark,
    ]);

    useEffect(() => {
        if (user?.role === ROLES.ADMIN) {
            dispatch(toggleThemeAdmin(localStorage.getItem('admin-theme') || themeAdminConfig.theme));
            dispatch(toggleMenuAdmin(localStorage.getItem('admin-menu') || themeAdminConfig.menu));
            dispatch(toggleLayoutAdmin(localStorage.getItem('admin-layout') || themeAdminConfig.layout));
            dispatch(toggleRTLAdmin(localStorage.getItem('admin-rtlClass') || themeAdminConfig.rtlClass));
            dispatch(toggleAnimationAdmin(localStorage.getItem('admin-animation') || themeAdminConfig.animation));
            dispatch(toggleNavbarAdmin(localStorage.getItem('admin-navbar') || themeAdminConfig.navbar));
            // dispatch(toggleLocaleAdmin(localStorage.getItem('admin-i18nextLng') || themeAdminConfig.locale));
            dispatch(toggleSemidarkAdmin(localStorage.getItem('admin-semidark') || themeAdminConfig.semidark));
        }
    }, [
        dispatch,
        themeAdminConfig.theme,
        themeAdminConfig.menu,
        themeAdminConfig.layout,
        themeAdminConfig.rtlClass,
        themeAdminConfig.animation,
        themeAdminConfig.navbar,
        themeAdminConfig.locale,
        themeAdminConfig.semidark,
    ]);

    return (
        <>
            {window.location.href.includes(AdminRoutes.PREFIX) ? (
                <div
                    className={`${(store.getState().themeAdminConfig.sidebar && 'toggle-sidebar') || ''} ${themeAdminConfig.menu} ${themeAdminConfig.layout} ${
                        themeAdminConfig.rtlClass
                    } main-section antialiased relative font-nunito text-sm font-normal`}
                >
                    <div onClick={() => toast.dismiss()}>
                        <Toaster position="top-right" toastOptions={{ duration: 5000 }} gutter={8} reverseOrder={false} />
                    </div>
                    {children}
                </div>
            ) : (
                <div
                    className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
                        themeConfig.rtlClass
                    } main-section antialiased relative font-nunito text-sm font-normal`}
                >
                    <div onClick={() => toast.dismiss()}>
                        <Toaster position="top-right" toastOptions={{ duration: 5000 }} gutter={8} reverseOrder={false} />
                    </div>
                    {children}
                </div>
            )}
        </>
    );
}

export default App;
