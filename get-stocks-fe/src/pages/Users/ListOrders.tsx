import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { ListPayment } from '../../features/history';
import { PackagePOrder } from '../../features/history/PackagePOrder';
import { useTranslation } from 'react-i18next';

type Props = {};

export const ListOrders = (props: Props) => {
    const { t } = useTranslation();

    return (
        <>
            <ListPayment />
        </>
    );
};

export default ListOrders;
