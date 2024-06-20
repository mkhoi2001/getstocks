import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';
import { User } from '../../../types/user';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { getUsersByFilterDate } from '../../../services/dashboardService';

type Props = {};

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const UserFilter = (props: Props) => {
    const [initialRecords, setInitialRecords] = useState<User[]>([]);
    const [fromDate, setFromDate] = useState<Date>(today);
    const [toDate, setToDate] = useState<Date>(tomorrow);
    const queryClient = useQueryClient();

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
        queryKey: ['usersByDate', fromDate, toDate],
        queryFn: () => getUsersByFilterDate({ fromDate, toDate }),
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'username', 'desc')]);
            }
        },
    });

    const { mutate: filterMutation } = useMutation({
        mutationFn: (data: { fromDate: Date; toDate: Date }) => getUsersByFilterDate(data),
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    rowData?.data.content.filter((item: User) => {
                        return (
                            item?.username?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.id?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.email?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.balanceG?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.balanceP?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.totalDeposit?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.role?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.phone?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.isActive?.toString().toLowerCase().includes(search.toLowerCase())
                        );
                    }),
                    'createdAT',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<User>[] = useMemo(
        () => [
            {
                accessor: 'id',
                title: 'ID',
                sortable: true,
                render: ({ id }) => {
                    return (
                        <div className="flex gap-1 items-center">
                            <Tippy content={'click_to_copy'} data-placement="top">
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
                accessor: 'username',
                title: 'Username',
                sortable: true,
            },
            { accessor: 'balanceG', title: '$', sortable: true },
            { accessor: 'balanceP', title: 'P', sortable: true },
            {
                accessor: 'totalDeposit',
                title: 'Tổng tiền nạp',
                sortable: true,
                render: ({ totalDeposit }) => {
                    const formattedNumber = totalDeposit?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 });
                    return formattedNumber;
                },
            },

            {
                accessor: 'isActive',
                title: 'Trạng thái',
                sortable: true,
                render: ({ isActive }) => {
                    return isActive ? (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-success rounded-full">{'Hoạt động'}</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-danger rounded-full">{'Bị khóa'}</span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <>
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

            <CustomDataTable<User>
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={'Người dùng'}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
        </>
    );
};

export default UserFilter;
