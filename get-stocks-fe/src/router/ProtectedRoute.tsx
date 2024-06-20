import React, { PropsWithChildren, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import { defaultRoute } from '../utils/const';
import { ROLES } from '../types/user';
import { logout } from '../store/userSlice';
import AuthRole from './AuthRole';

type Props = {
    roles: string[];
};

type PropsProtected = Props & PropsWithChildren;

function ProtectedRoute({ children, roles }: PropsProtected) {
    const { isLogin }: { isLogin: boolean; info: any } = useSelector((state: IRootState) => state.user.data);
    // return isLogin ? (
    //     <>
    //         <Outlet />
    //     </>
    // ) : (
    //     <Navigate to={path} />
    // );

    return isLogin ? (
        <>
            <AuthRole roles={roles}>
                <Outlet />
            </AuthRole>
        </>
    ) : (
        <Navigate to={AppRoutes.SIGN_IN} />
    );
}

export default ProtectedRoute;
