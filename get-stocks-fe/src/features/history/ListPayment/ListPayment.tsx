import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../../../store';
import Tippy from '@tippyjs/react';
import orderBy from 'lodash/orderBy';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { getAllOrderHistoryByOwn } from '../../../services/paymentService';
import toast from 'react-hot-toast';
import { Order } from '../../../types/order';
import { CustomDataTable } from '../../../components';
import { formatDate } from '../../../utils/formatDate';
import { OrderStatus } from '../../../types/order';
import { useTranslation } from 'react-i18next';

type Props = {};

export const ListPayment = (props: Props) => {
    const user = useSelector((state: IRootState) => state.user.data.info);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setPageTitle(t('order_history_tab')));
    }, []);

    const [initialRecords, setInitialRecords] = useState<Order[]>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'updatedAt',
        direction: 'desc',
    });

    const {
        data: rowData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['orders', user?.id],
        queryFn: getAllOrderHistoryByOwn,
        enabled: !!user?.id,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'updatedAt', 'desc')]);
            }
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    rowData?.data.content.filter((item: Order) => {
                        return (
                            item?.packageType?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.packagePricingPId?.toString().includes(search.toLowerCase()) ||
                            item?.packagePricingGId?.toString().includes(search.toLowerCase()) ||
                            item?.reason?.toString().includes(search.toLowerCase()) ||
                            item?.cost?.toString().includes(search.toLowerCase()) ||
                            item?.provider?.toString().includes(search.toLowerCase()) ||
                            item?.cardNumber?.toString().includes(search.toLowerCase()) ||
                            item?.content?.toString().includes(search.toLowerCase())
                        );
                    }),
                    'updatedAt',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<Order>[] = useMemo(
        () => [
            {
                accessor: 'id',
                title: 'ID',
                sortable: true,
                render: ({ id }) => {
                    return (
                        <>
                            <Tippy content={id}>
                                <div className="text-ellipsis overflow-hidden ... max-w-[50px]">{id}</div>
                            </Tippy>
                        </>
                    );
                },
            },
            {
                accessor: 'packageType',
                title: t('package_name'),
                sortable: true,
                render: ({ packagePricingG, packagePricingP }) => {
                    return (
                        <>
                            <div className="text-ellipsis overflow-hidden ... max-w-[120px]">{packagePricingG?.name || packagePricingP?.name}</div>
                        </>
                    );
                },
            },
            {
                accessor: 'provider',
                title: t('provider_payment'),
                sortable: true,
            },
            {
                accessor: 'cost',
                title: 'Giá gói',
                sortable: true,
                render: ({ cost }) => {
                    const formattedNumber = cost?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 });
                    return formattedNumber;
                },
            },
            {
                accessor: 'costPayment',
                title: 'Tiền thanh toán',
                sortable: true,
                render: ({ costPayment, currency }) => {
                    if (currency.toLowerCase() == 'usd') {
                        return costPayment?.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                        });
                    }
                    const formattedNumber = costPayment?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 });
                    return formattedNumber;
                },
            },
            {
                accessor: 'content',
                title: t('content_order'),
                sortable: true,
            },
            {
                accessor: 'reason',
                title: t('note_order'),
                sortable: true,
            },
            {
                accessor: 'createdAt',
                title: t('date_order'),
                sortable: true,
                render: ({ createdAt }) => {
                    return (
                        <>
                            <div>{formatDate(createdAt)}</div>
                        </>
                    );
                },
            },
            {
                accessor: 'status',
                title: t('state_order'),
                sortable: true,
                render: ({ status }) => {
                    if (status === OrderStatus.PENDING) {
                        return (
                            <div className="flex items-center justify-center w-1/2">
                                <span className="badge bg-info rounded-full">{t('pending')}</span>
                            </div>
                        );
                    }

                    if (status === OrderStatus.SUCCESS) {
                        return (
                            <div className="flex items-center justify-center w-1/2">
                                <span className="badge bg-success rounded-full">{t('success')}</span>
                            </div>
                        );
                    }

                    return (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-danger rounded-full">{t('fail')}</span>
                        </div>
                    );
                },
            },
        ],
        [t]
    );
    return (
        <div>
            <CustomDataTable<Order>
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={t('order_history_tab')}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
            <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                {t('reload')}
            </button>
        </div>
    );
};

export default ListPayment;
