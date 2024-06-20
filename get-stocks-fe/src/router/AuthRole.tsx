import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../store';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../types/user';
import { defaultRoute } from '../utils/const';
import { logout } from '../store/userSlice';
import { AppRoutes } from './routes';

type Props = {
    roles: string[];
    children: any;
};

const AuthRole = ({ children, roles }: Props) => {
    const { info: user } = useSelector((state: IRootState) => state.user.data);
    const dispatch = useDispatch();

    if (user && !Object.values(ROLES).includes(user?.role)) {
        dispatch(logout());
    }

    if (user && !roles.includes(user?.role)) {
        // return <Navigate to={defaultRoute[user?.role]} />;
        return <Navigate to={AppRoutes.NOT_FOUND_PAGE} />;
    }

    return <div>{children}</div>;
};

export default AuthRole;
