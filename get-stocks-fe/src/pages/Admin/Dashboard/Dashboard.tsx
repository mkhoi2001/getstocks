import { Box, Chart, TabFilter } from '../../../features/dashboard';

type Props = {};

const Dashboard = (props: Props) => {
    return (
        <div>
            <div>
                <Box />
            </div>
            <div className="">
                <Chart />
            </div>
            <div className="">
                <TabFilter />
            </div>
        </div>
    );
};

export default Dashboard;
