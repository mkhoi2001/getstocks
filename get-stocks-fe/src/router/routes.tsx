import { lazy } from 'react';
import { ROLES } from '../types/user';

// LAYOUT PAGES
const DefaultLayout = lazy(() => import('../components/Layouts/DefaultLayout'));
const BlankLayout = lazy(() => import('../components/Layouts/BlankLayout'));
const AdminLayout = lazy(() => import('../components/Layouts/Admin/AdminLayout'));

// ADMIN PAGES
const DashboardDefault = lazy(() => import('../pages/Admin/Dashboard'));
const DashboardAdmin = lazy(() => import('../pages/Admin/Dashboard/Dashboard'));
const ManageUserPage = lazy(() => import('../pages/Admin/Users/Dashboard'));
const UserDetailPage = lazy(() => import('../pages/Admin/Users/UserDetail'));
const ManageStockPage = lazy(() => import('../pages/Admin/Stocks/Dashboard'));
const StockDetailPage = lazy(() => import('../pages/Admin/Stocks/StockDetail'));
const ManagePackageGPage = lazy(() => import('../pages/Admin/PackageG/Dashboard'));
const PackageGDetailPage = lazy(() => import('../pages/Admin/PackageG/PackageGDetail'));
const ManagePackagePPage = lazy(() => import('../pages/Admin/PackageP/Dashboard'));
const PackagePDetailPage = lazy(() => import('../pages/Admin/PackageP/PackagePDetail'));
const ManageSystemPage = lazy(() => import('../pages/Admin/System/Dashboard'));
const ManageBankPage = lazy(() => import('../pages/Admin/Bank/Dashboard'));
const BankDetailPage = lazy(() => import('../pages/Admin/Bank/BankDetail'));
const UserPurchasePage = lazy(() => import('../pages/Admin/UserPurchase/Dashboard'));
const UserDownloadPage = lazy(() => import('../pages/Admin/UserDownload/Dashboard'));
const SettingPage = lazy(() => import('../pages/Admin/Setting/Setting'));
const ProfileAdminPage = lazy(() => import('../pages/Admin/Profile/AdminInfo'));
const SignInAdminPage = lazy(() => import('../pages/Admin/Authentication/SignInPage'));
const GetStockProviderPage = lazy(() => import('../pages/Admin/GetStock/Provider'));
const GetStockProviderDetail = lazy(() => import('../pages/Admin/GetStock/ProviderDetail'));

// THIRD PARTY
const GetStockPage = lazy(() => import('../pages/Admin/System/GetStock/GetStock'));

// USER PAGES
const DashboardUser = lazy(() => import('../pages/Users/Dashboard'));
const Profile = lazy(() => import('../pages/Users/Profile'));
const PurchasePackageG = lazy(() => import('../pages/Users/PurchasePackageG'));
const PurchasePackageP = lazy(() => import('../pages/Users/PurchasePackageP'));
const ListOrders = lazy(() => import('../pages/Users/ListOrders'));
const ListItems = lazy(() => import('../pages/Users/ListItems'));
const Payment = lazy(() => import('../pages/Users/Payment'));
const DocumentPage = lazy(() => import('../pages/Users/DocumentAPI'));
const PackagePOrder = lazy(() => import('../pages/Users/PackagePOrder'));

// PUBLIC PAGES
const SignInPage = lazy(() => import('../pages/Authentication/SignInPage'));
const SignUpPage = lazy(() => import('../pages/Authentication/SignUpPage'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const PasswordResetPage = lazy(() => import('../pages/Authentication/PasswordResetPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Authentication/ForgotPasswordPage'));
const VerifyTokenResetPage = lazy(() => import('../pages/Authentication/VerifyTokenRestPage'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));

const PREFIX_ADMIN_ROUTE = '/admin';
export const AdminRoutes = {
    PREFIX: PREFIX_ADMIN_ROUTE,
    USER: `${PREFIX_ADMIN_ROUTE}/users`,
    USER_DETAIL: `${PREFIX_ADMIN_ROUTE}/users/:id`,
    DASHBOARD_ADMIN: `${PREFIX_ADMIN_ROUTE}/dashboard`,
    DASHBOARD_ADMIN_DEFAULT: PREFIX_ADMIN_ROUTE,
    STOCK: `${PREFIX_ADMIN_ROUTE}/stocks`,
    STOCK_DETAIL: `${PREFIX_ADMIN_ROUTE}/stocks/:id`,
    PACKAGE_G: `${PREFIX_ADMIN_ROUTE}/packages/g`,
    PACKAGE_G_DETAIL: `${PREFIX_ADMIN_ROUTE}/packages/g/:id`,
    PACKAGE_P: `${PREFIX_ADMIN_ROUTE}/packages/p`,
    PACKAGE_P_DETAIL: `${PREFIX_ADMIN_ROUTE}/packages/p/:id`,
    SYSTEM: `${PREFIX_ADMIN_ROUTE}/systems`,
    SYSTEM_DETAIL: `${PREFIX_ADMIN_ROUTE}/systems/:id`,
    SYSTEM_GETSTOCK: `${PREFIX_ADMIN_ROUTE}/system/getstock`,
    BANK: `${PREFIX_ADMIN_ROUTE}/bank`,
    BANK_DETAIL: `${PREFIX_ADMIN_ROUTE}/bank/:id`,
    USER_PURCHASE: `${PREFIX_ADMIN_ROUTE}/user-payment`,
    USER_DOWNLOAD: `${PREFIX_ADMIN_ROUTE}/user-download`,
    SETTING: `${PREFIX_ADMIN_ROUTE}/setting`,
    PROFILE: `${PREFIX_ADMIN_ROUTE}/profile`,
    AUTH: `${PREFIX_ADMIN_ROUTE}/auth`,
    GET_STOCK_PROV: `${PREFIX_ADMIN_ROUTE}/getstock/provider`,
    GET_STOCK_PROV_DETAIL: `${PREFIX_ADMIN_ROUTE}/getstock/provider/:id`,
};

export interface RoutesType {
    [key: string]: string;
}

export const changeAppRoutesByLang = (lang: string) => {
    Object.keys(DefaultAppRoutes).forEach((route: string) => {
        AppRoutes[route] = lang ? `/${lang}${DefaultAppRoutes[route]}` : `${DefaultAppRoutes[route]}`;
    });
};

export const DefaultAppRoutes: RoutesType = {
    DASHBOARD_USER: '/',
    SERVER_ERROR: '/server-error',
    PROFILE: '/profile',
    PACKAGE_G: '/package-g',
    PACKAGE_P: '/package-p',
    HISTORY_PAY: '/history/pay',
    HISTORY_DOWN: '/history/download',
    PURCHASE_PACKAGE_G: '/packages/g',
    PURCHASE_PACKAGE_P: '/packages/p',
    PAYMENT: '/payment',
    DOCUMENT: '/apidoc',
    PACKAGE_P_ORDER: '/packages/used',
};

export const AppRoutes: RoutesType = {
    SIGN_IN: '/signin',
    SIGN_UP: '/signup',
    PASSWORD_RESET: '/reset',
    FORGOT_PASSWORD: '/forgot',
    VERIFY_TOKEN_RESET: '/verify-forgot',
    NOT_FOUND_PAGE: '/404',
    // DASHBOARD_USER: '/',
    // SERVER_ERROR: '/server-error',
    // PROFILE: '/profile',
    // PACKAGE_G: '/package-g',
    // PACKAGE_P: '/package-p',
    // HISTORY_PAY: '/history/pay',
    // HISTORY_DOWN: '/history/download',
    // PURCHASE_PACKAGE_G: '/packages/g',
    // PURCHASE_PACKAGE_P: '/packages/p',
    // PAYMENT: '/payment',
    // DOCUMENT: '/apidoc',
    // PACKAGE_P_ORDER: 'packages/used',
    ...DefaultAppRoutes,
};

const routes = [
    {
        layout: 'admin',
        protected: true,
        roles: [ROLES.ADMIN],
        element: <AdminLayout />,
        children: [
            {
                path: AdminRoutes.DASHBOARD_ADMIN_DEFAULT,
                protected: true,
                element: <DashboardDefault />,
            },
            {
                path: AdminRoutes.DASHBOARD_ADMIN,
                protected: true,
                element: <DashboardAdmin />,
            },
            {
                path: AdminRoutes.USER,
                protected: true,
                element: <ManageUserPage />,
                children: [],
            },
            {
                path: AdminRoutes.USER_DETAIL,
                protected: true,
                element: <UserDetailPage />,
            },
            {
                path: AdminRoutes.STOCK,
                protected: true,
                element: <ManageStockPage />,
                children: [],
            },
            {
                path: AdminRoutes.STOCK_DETAIL,
                protected: true,
                element: <StockDetailPage />,
            },
            {
                path: AdminRoutes.PACKAGE_G,
                protected: true,
                element: <ManagePackageGPage />,
                children: [],
            },
            {
                path: AdminRoutes.PACKAGE_G_DETAIL,
                protected: true,
                element: <PackageGDetailPage />,
            },
            {
                path: AdminRoutes.PACKAGE_P,
                protected: true,
                element: <ManagePackagePPage />,
                children: [],
            },
            {
                path: AdminRoutes.PACKAGE_P_DETAIL,
                protected: true,
                element: <PackagePDetailPage />,
            },
            {
                path: AdminRoutes.SYSTEM,
                protected: true,
                element: <ManageSystemPage />,
                children: [],
            },
            {
                path: AdminRoutes.SYSTEM_GETSTOCK,
                protected: true,
                element: <GetStockPage />,
            },
            {
                path: AdminRoutes.BANK,
                protected: true,
                element: <ManageBankPage />,
            },
            {
                path: AdminRoutes.BANK_DETAIL,
                protected: true,
                element: <BankDetailPage />,
            },
            {
                path: AdminRoutes.USER_PURCHASE,
                protected: true,
                element: <UserPurchasePage />,
            },
            {
                path: AdminRoutes.USER_DOWNLOAD,
                protected: true,
                element: <UserDownloadPage />,
            },
            {
                path: AdminRoutes.SETTING,
                protected: true,
                element: <SettingPage />,
            },
            {
                path: AdminRoutes.PROFILE,
                protected: true,
                // element: <ProfileAdminPage />,
                element: <Profile />,
            },
            {
                path: AdminRoutes.GET_STOCK_PROV,
                protected: true,
                element: <GetStockProviderPage />,
            },
            {
                path: AdminRoutes.GET_STOCK_PROV_DETAIL,
                protected: true,
                element: <GetStockProviderDetail />,
            },
        ],
    },
    {
        roles: [ROLES.USER, ROLES.ADMIN],
        layout: 'user',
        protected: true,
        element: <DefaultLayout />,
        children: [
            {
                path: AppRoutes.DASHBOARD_USER,
                element: <DashboardUser />,
                protected: true,
            },
            {
                path: AppRoutes.PURCHASE_PACKAGE_G,
                element: <PurchasePackageG />,
                protected: true,
            },
            {
                path: AppRoutes.PURCHASE_PACKAGE_P,
                element: <PurchasePackageP />,
                protected: true,
            },
            {
                path: AppRoutes.PACKAGE_P_ORDER,
                element: <PackagePOrder />,
                protected: true,
            },
            {
                path: AppRoutes.HISTORY_PAY,
                protected: true,
                element: <ListOrders />,
            },
            {
                path: AppRoutes.HISTORY_DOWN,
                protected: true,
                element: <ListItems />,
            },
            {
                path: AppRoutes.PAYMENT,
                protected: true,
                element: <Payment />,
            },
            {
                path: AppRoutes.PROFILE,
                protected: true,
                element: <Profile />,
            },
            {
                path: AppRoutes.DOCUMENT,
                protected: true,
                element: <DocumentPage />,
            },
        ],
    },
    {
        layout: 'blank',
        protected: false,
        element: <BlankLayout />,
        children: [
            { path: AppRoutes.SIGN_IN, element: <SignInPage />, protected: false },
            { path: AdminRoutes.AUTH, element: <SignInAdminPage />, protected: false },
            { path: AppRoutes.SIGN_UP, element: <SignUpPage />, protected: false },
            {
                path: AppRoutes.PASSWORD_RESET,
                protected: false,
                element: <PasswordResetPage />,
            },
            { path: AppRoutes.FORGOT_PASSWORD, element: <ForgotPasswordPage />, protected: false },
            { path: AppRoutes.VERIFY_TOKEN_RESET, element: <VerifyTokenResetPage />, protected: false },
        ],
    },
    {
        path: AppRoutes.NOT_FOUND_PAGE,
        element: <ERROR404 />,
        protected: false,
    },
    {
        path: AppRoutes.SERVER_ERROR,
        element: <ERROR500 />,
        protected: false,
    },

    {
        path: '*',
        element: <ERROR404 />,
        protected: false,
    },
];

// const routes = [
//     { path: AppRoutes.PROFILE, element: <Profile />, protected: true },
//     { path: AppRoutes.DASHBOARD_USER, element: <DashboardUser />, protected: true, exact: true },
//     { path: AppRoutes.SIGN_IN, element: <SignInPage />, layout: 'blank', protected: false },
//     { path: AppRoutes.SIGN_UP, element: <SignUpPage />, layout: 'blank', protected: false },
//     { path: AppRoutes.PASSWORD_RESET, element: <PasswordResetPage />, layout: 'blank', protected: false },
//     {
//         path: AppRoutes.NOT_FOUND_PAGE,
//         element: <ERROR404 />,
//         layout: 'blank',
//         protected: false,
//     },
//     {
//         path: '/pages/error500',
//         element: <ERROR500 />,
//         layout: 'blank',
//         protected: false,
//     },
//     {
//         path: '/pages/error503',
//         element: <ERROR503 />,
//         layout: 'blank',
//         protected: false,
//     },
// ];

export { routes };
