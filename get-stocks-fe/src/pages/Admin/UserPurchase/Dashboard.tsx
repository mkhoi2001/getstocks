import { useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import orderBy from 'lodash/orderBy';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';
import { formatDate } from '../../../utils/formatDate';
import { OrderStatus } from '../../../types/order';
import { Order } from '../../../types/order';
import { getAllOrderHistory, orderSuccess, orderFail } from '../../../services/paymentService';
import { StatusForm } from './Components';
import { PackageType } from '../../../types/stock';

type Props = {};

const Dashboard = (props: Props) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Thống kê mua hàng'));
    }, []);

    const [initialRecords, setInitialRecords] = useState<Order[]>([]);
    const [isSelect, setIsSelect] = useState<boolean>(false);
    const [order, setOrder] = useState<Order | undefined>(undefined);
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
        queryKey: ['orders'],
        queryFn: getAllOrderHistory,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data?.data?.content, 'updatedAt', 'desc')]);
            }
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const {
        mutate: changeOrderSuccessMutation,
        isLoading: isLoadingSuccessStatus,
        isSuccess: isSuccessSuccessStatus,
    } = useMutation({
        mutationFn: orderSuccess,
        onSuccess: (data) => {
            toast.success('Cập nhật đơn hàng thành công');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const { mutate: changeOrderFailMutation, isLoading: isLoadingFailStatus } = useMutation({
        mutationFn: orderFail,
        onSuccess: (data) => {
            toast.success('Cập nhật đơn hàng thành công');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
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
                            item?.user?.email?.toString().includes(search.toLowerCase()) ||
                            item?.user?.id?.toString().includes(search.toLowerCase()) ||
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
                        <div className="flex gap-1 items-center">
                            <Tippy content={`Click to copy`} data-placement="top">
                                <p
                                    onClick={() => {
                                        navigator.clipboard.writeText(id || '');
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
                                        navigator.clipboard.writeText(id || '');
                                    }}
                                    className=" text-ellipsis overflow-hidden ... max-w-[50px]"
                                >
                                    {id}
                                </div>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                accessor: 'name',
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
                accessor: 'packageType',
                title: 'Loại gói',
                sortable: true,
                render: ({ packagePricingG, packagePricingP }) => {
                    return (
                        <>
                            <div className="text-ellipsis overflow-hidden ... max-w-[120px]">{packagePricingG ? 'Tiết kiệm' : 'Thường xuyên'}</div>
                        </>
                    );
                },
            },
            // {
            //     accessor: 'userId',
            //     title: 'UserId',
            //     sortable: true,
            //     render: ({ userId }) => {
            //         return (
            //             <div className="flex gap-1 items-center">
            //                 <Tippy content={`Click to copy`} data-placement="top">
            //                     <p
            //                         onClick={() => {
            //                             navigator.clipboard.writeText(userId || '');
            //                         }}
            //                         className="hover:cursor-pointer"
            //                     >
            //                         <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                             <path
            //                                 d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
            //                                 stroke="#1C274C"
            //                                 strokeWidth="1.5"
            //                             />
            //                             <path
            //                                 d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
            //                                 stroke="#1C274C"
            //                                 strokeWidth="1.5"
            //                             />
            //                         </svg>
            //                     </p>
            //                 </Tippy>
            //                 <Tippy content={`${userId}`} data-placement="top">
            //                     <div
            //                         onClick={() => {
            //                             navigator.clipboard.writeText(userId || '');
            //                         }}
            //                         className=" text-ellipsis overflow-hidden ... max-w-[50px]"
            //                     >
            //                         {userId}
            //                     </div>
            //                 </Tippy>
            //             </div>
            //         );
            //     },
            // },
            {
                accessor: 'user',
                title: 'Email',
                sortable: true,
                render: ({ user }) => <p>{user?.email}</p>,
            },
            {
                accessor: 'provider',
                title: 'Ngân hàng / Ví',
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
            {
                accessor: 'action',
                title: 'Thao tác',
                sortable: false,
                render: (currentOrder) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Tippy content="Chỉnh sửa">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOrder(currentOrder ? currentOrder : undefined);
                                        setIsSelect(true);
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-edit"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                </button>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                accessor: 'reason',
                title: 'Ghi chú',
                sortable: true,
            },
        ],
        []
    );

    const handleSubmit = (data: { value: string; label: string }, reason: string) => {
        if (data.value === OrderStatus.FAIL) {
            changeOrderFailMutation({ id: order?.id, reason: reason });
        } else if (data.value === OrderStatus.SUCCESS) {
            changeOrderSuccessMutation(order?.id);
        }
    };

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
                title={'Thống kê mua hàng'}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
            <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                Reload
            </button>
            {isSelect ? (
                <StatusForm
                    handleSubmit={handleSubmit}
                    isOpen={isSelect}
                    setIsOpen={setIsSelect}
                    title={'Thay đổi trạng thái đơn hàng'}
                    message={
                        <div>
                            <p> Mã đơn hàng: ${order?.id}</p>
                            {/* <p className="text-red-500">Không thể hoàn tác</p> */}
                        </div>
                    }
                />
            ) : (
                ''
            )}
        </div>
    );
};

export default Dashboard;
