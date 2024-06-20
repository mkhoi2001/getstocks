import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';

function PublicRoute({ children }: PropsWithChildren) {
    const { isLogin } = useSelector((state: IRootState) => state.user.data);
    const location = useLocation();
    // const path = `${location.pathname}${location.search}` || AppRoutes.DASHBOARD_USER;
    const path = AppRoutes.DASHBOARD_USER;
    return !isLogin ? (
        <>
            <Outlet />
        </>
    ) : (
        // <>dsf</>
        <Navigate to={path} />
    );
}

export default PublicRoute;
