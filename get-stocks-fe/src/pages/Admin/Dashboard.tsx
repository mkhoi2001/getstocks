import { Navigate } from 'react-router-dom';
import { AdminRoutes } from '../../router/routes';

type Props = {};

const DashboardDefault = (props: Props) => {
    return <Navigate to={AdminRoutes.DASHBOARD_ADMIN} />;
};

export default DashboardDefault;
