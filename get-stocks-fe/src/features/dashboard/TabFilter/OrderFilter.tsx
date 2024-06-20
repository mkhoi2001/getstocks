import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { getOrdersByFilterDate } from '../../../services/dashboardService';
import { Order, OrderStatus } from '../../../types/order';
import { formatDate } from '../../../utils/formatDate';

type Props = {};
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const OrderFilter = (props: Props) => {
    const [initialRecords, setInitialRecords] = useState<Order[]>([]);
    const [toDate, setToDate] = useState<Date>(tomorrow);
    const [fromDate, setFromDate] = useState<Date>(today);
    const queryClient = useQueryClient();

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'createdAt',
        direction: 'desc',
    });

    const {
        data: rowData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['ordersByDate', fromDate, toDate],
        queryFn: () => getOrdersByFilterDate({ fromDate, toDate }),
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'updatedAt', 'desc')]);
            }
        },
        onError: (error: any) => {
            toast.error(error.message);
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
                    'createdAt',
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
                title: 'Tên gói',
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
                title: 'Thanh toán',
                sortable: true,
            },
            {
                accessor: 'content',
                title: 'Nội dung',
                sortable: true,
            },
            {
                accessor: 'reason',
                title: 'Ghi chú',
                sortable: true,
            },
            {
                accessor: 'createdAt',
                title: 'Ngày mua',
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
                title: 'Trạng thái',
                sortable: true,
                render: ({ status }) => {
                    if (status === OrderStatus.PENDING) {
                        return (
                            <div className="flex items-center justify-center w-1/2">
                                <span className="badge bg-info rounded-full">Đang kiểm tra</span>
                            </div>
                        );
                    }

                    if (status === OrderStatus.SUCCESS) {
                        return (
                            <div className="flex items-center justify-center w-1/2">
                                <span className="badge bg-success rounded-full">Thành công</span>
                            </div>
                        );
                    }

                    return (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-danger rounded-full">Thất bại</span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <div>
            <div className="flex gap-3">
                <div className="flex  gap-4 pb-3">
                    <div className="flex items-center gap-2">
                        <span>Từ</span>
                        <Flatpickr
                            value={fromDate}
                            options={{ maxDate: today, dateFormat: 'Y-m-d', position: 'auto right' }}
                            className="form-input"
                            onChange={(date) => {
                                setFromDate(date[0]);
                                refetch();
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span>Đến</span>
                        <Flatpickr
                            value={toDate}
                            options={{ minDate: today, dateFormat: 'Y-m-d', position: 'auto right' }}
                            className="form-input"
                            onChange={(date) => {
                                setToDate(date[0]);
                                refetch();
                            }}
                        />
                    </div>
                </div>
                <div>
                    {/* <button className="btn btn-info" onClick={() => refetch()}>
                        Loc
                    </button> */}
                </div>
            </div>

            <CustomDataTable<Order>
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={'Lượt tải'}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
        </div>
    );
};

export default OrderFilter;
