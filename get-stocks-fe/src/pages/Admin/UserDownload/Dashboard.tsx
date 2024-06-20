import { useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react';
import orderBy from 'lodash/orderBy';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';
import { formatDateTime } from '../../../utils/formatDate';
import { ItemHistory } from '../../../types/item';
import { getAllItemHistory } from '../../../services/itemService';

type Props = {};

export const Dashboard = (props: Props) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Thống kê tải'));
    }, []);

    const [initialRecords, setInitialRecords] = useState<ItemHistory[]>([]);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

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
        queryKey: ['itemHistory'],
        queryFn: () => getAllItemHistory(),
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
                    rowData?.data.content.filter((item: ItemHistory) => {
                        return (
                            item?.createdAt?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item?.extension?.toString().includes(search.toLowerCase()) ||
                            item?.fileName?.toString().includes(search.toLowerCase()) ||
                            item?.provider?.toString().includes(search.toLowerCase()) ||
                            item?.itemDCode?.toString().includes(search.toLowerCase())
                        );
                    }),
                    'updatedAt',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<ItemHistory>[] = useMemo(
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
                accessor: 'userId',
                title: 'UserId',
                sortable: true,
                render: ({ userId }) => {
                    return (
                        <div className="flex gap-1 items-center">
                            <Tippy content={`Click to copy`} data-placement="top">
                                <p
                                    onClick={() => {
                                        navigator.clipboard.writeText(userId || '');
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
                            <Tippy content={`${userId}`} data-placement="top">
                                <div
                                    onClick={() => {
                                        navigator.clipboard.writeText(userId || '');
                                    }}
                                    className=" text-ellipsis overflow-hidden ... max-w-[50px]"
                                >
                                    {userId}
                                </div>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                accessor: 'user',
                title: 'Email',
                sortable: true,
                render: ({ user }) => <p>{user?.email}</p>,
            },
            {
                accessor: 'link',
                title: 'Link',
                sortable: true,
                render: ({ link }) => {
                    return (
                        <div className="flex gap-1 items-center">
                            <Tippy content={'Click để sao chép'} data-placement="top">
                                <p
                                    onClick={() => {
                                        navigator.clipboard.writeText(link || '');
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
                            <Tippy content={link}>
                                <div className="text-ellipsis overflow-hidden ... max-w-[50px]">{link}</div>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                accessor: 'provider',
                title: 'Stock',
                sortable: true,
            },
            {
                accessor: 'cost',
                title: 'Giá tải',
                sortable: true,
                // render: ({ cost }) => {
                //     const formattedNumber = cost?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 2, maximumFractionDigits: 2 });
                //     return formattedNumber;
                // },
            },
            {
                accessor: 'itemDCode',
                title: 'ID item tải',
                sortable: true,
                render: ({ itemDCode }) => {
                    return (
                        <div className="flex gap-1 items-center">
                            <Tippy content={`Click to copy`} data-placement="top">
                                <p
                                    onClick={() => {
                                        navigator.clipboard.writeText(itemDCode || '');
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
                            <Tippy content={`${itemDCode}`} data-placement="top">
                                <div
                                    onClick={() => {
                                        navigator.clipboard.writeText(itemDCode || '');
                                    }}
                                    className=" text-ellipsis overflow-hidden ... max-w-[50px]"
                                >
                                    {itemDCode}
                                </div>
                            </Tippy>
                        </div>
                    );
                },
            },
            {
                accessor: 'extension',
                title: 'Loại file',
                sortable: true,
            },
            {
                accessor: 'createdAt',
                title: 'Ngày tải',
                sortable: true,
                render: ({ createdAt }) => {
                    return (
                        <>
                            <div>{formatDateTime(createdAt)}</div>
                        </>
                    );
                },
            },
        ],
        []
    );

    return (
        <div>
            <div>
                <CustomDataTable<ItemHistory>
                    initialRecords={initialRecords}
                    search={search}
                    setSearch={setSearch}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    columns={columns}
                    setInitialRecords={setInitialRecords}
                    title={'Lịch sử tải'}
                    sortStatus={sortStatus}
                    setSortStatus={setSortStatus}
                    enableAdd={false}
                />
                <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                    {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                    Reload
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
