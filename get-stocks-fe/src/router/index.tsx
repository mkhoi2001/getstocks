import { RouteObject, createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import { RouterProvider } from 'react-router-dom';
import AuthRole from './AuthRole';
import { ROLES } from '../types/user';

// const finalRoutes = routes.map((route) => {
//     return {
//         ...route,
//         element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
//     };
// });

export const AppLangs = ['en', 'vn'];

const RenderRoutes = () => {
    const { isLogin } = useSelector((state: IRootState) => state.user.data);

    const arrayRoutes = useMemo(() => {
        const protectedRoutes: any = {
            // element: <ProtectedRoute />,
            children: [],
        };
        const publicRoutes: any = {
            element: <PublicRoute />,
            children: [],
        };

        const defaultRoutes: any = {
            children: [],
        };

        routes.forEach((route: any) => {
            if (route.layout) {
                if (route.protected) {
                    protectedRoutes?.children?.push({
                        element: <ProtectedRoute roles={route.roles} />,
                        children: [route],
                    });

                    if (route.roles.includes(ROLES.USER)) {
                        AppLangs.forEach((lang: string) => {
                            protectedRoutes?.children?.push({
                                element: <ProtectedRoute roles={route.roles} />,
                                protected: true,
                                children: [
                                    {
                                        element: <DefaultLayout />,
                                        children: [...route?.children?.map((routeChild: any) => ({ ...routeChild, path: `/${lang}${routeChild.path}` }))],
                                    },
                                ],
                            });
                        });
                    }
                    return;
                }

                publicRoutes?.children?.push(route);
            } else {
                defaultRoutes?.children?.push(route);
            }
        });

        return [protectedRoutes, publicRoutes, defaultRoutes];
    }, [isLogin]);

    const router = createBrowserRouter(arrayRoutes);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default RenderRoutes;

// const router = createBrowserRouter(finalRoutes);
// const router = createBrowserRouter(routes);

// export default router;
