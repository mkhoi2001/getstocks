import { useState, useEffect, useMemo } from 'react';
import { System } from '../../../types/system';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../../services/getStockService';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import orderBy from 'lodash/orderBy';
import { CustomDataTable } from '../../../components';
import { Order } from './types/order';
import Tippy from '@tippyjs/react';

type Props = {
    system?: System;
};

export const StockOrder = ({ system }: Props) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch(setPageTitle('getstock'));
    }, []);

    const [initialRecords, setInitialRecords] = useState<Order[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'updatedAt',
        direction: 'desc',
    });

    const {
        data: ordersData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['getstocksOrder', system?.id],
        queryFn: () => getOrders(system?.id),
        enabled: !!system,
        staleTime: Infinity,
        onSuccess: (data) => {
            setInitialRecords([...orderBy(data?.data?.order, 'updatedAt', 'desc')]);
        },
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    ordersData?.data?.order?.filter((item: Order) => {
                        return (
                            item?.oTransID?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item?.email?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item?.oID?.toString().includes(search.toLowerCase()) ||
                            item?.oPayerAccount?.toString().includes(search.toLowerCase()) ||
                            item?.oPayeeAccount?.toString().includes(search.toLowerCase()) ||
                            item?.oPayProvider?.toString().includes(search.toLowerCase()) ||
                            item?.oTotalCost?.toString().includes(search.toLowerCase()) ||
                            item?.status?.toString().includes(search.toLowerCase()) ||
                            item?.oCurrency?.toString().includes(search.toLowerCase())
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
                render: ({ id }) => (
                    <div className="flex gap-1 items-center">
                        <Tippy content={`Click to copy`} data-placement="top">
                            <p
                                onClick={() => {
                                    navigator.clipboard.writeText(id.toString() || '');
                                }}
                                className="hover:cursor-pointer"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                        stroke="#1C274C"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                        stroke="#1C274C"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </p>
                        </Tippy>
                        <Tippy content={`${id}`} data-placement="top">
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(id.toString() || '');
                                }}
                                className=" text-ellipsis overflow-hidden ... max-w-[50px]"
                            >
                                {id}
                            </div>
                        </Tippy>
                    </div>
                ),
            },
            {
                accessor: 'email',
                title: 'Email',
                sortable: true,
            },
            {
                accessor: 'oID',
                title: 'Nội dung',
                sortable: true,
            },
            {
                accessor: 'oPayerAccount',
                title: 'oPayerAccount',
                sortable: true,
            },
            {
                accessor: 'oPayeeAccount',
                title: 'oPayeeAccount',
                sortable: true,
            },
            {
                accessor: 'oPayProvider',
                title: 'Hình thức',
                sortable: true,
            },
            {
                accessor: 'oTotalCost',
                title: 'Số tiền',
                sortable: true,
            },
            {
                accessor: 'status',
                title: 'Trạng thái',
                sortable: true,
            },
            {
                accessor: 'oCurrency',
                title: 'Tiền tệ',
                sortable: true,
            },
        ],
        []
    );

    return (
        <div>
            <CustomDataTable
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={'Lịch sử nạp'}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
            <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                Reload
            </button>
        </div>
    );
};

export default StockOrder;
