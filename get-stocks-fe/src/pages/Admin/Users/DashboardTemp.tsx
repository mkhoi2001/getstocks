import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { getAllUsers, changeUserStatus } from '../../../services/userService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ROLES, User } from '../../../types/user';
import { UserModal } from './Components';
import { ConfirmModal } from '../../../components';
import { FormType } from '../../../utils/const';
import { useNavigate } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';

const DashboardTemp = () => {
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Người dùng'));
    });
    // const [page, setPage] = useState(1);
    // const PAGE_SIZES = [10, 20, 30, 50, 100];
    // const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<User[]>([]);
    // const [recordsData, setRecordsData] = useState(initialRecords);
    const [userId, setUserId] = useState<string>('');

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    const queryClient = useQueryClient();

    const { mutate: changeUserStatusMutation } = useMutation({
        mutationFn: changeUserStatus,
        onSuccess: (data) => {
            queryClient.setQueriesData(['users'], (oldData: any) => {
                const dataReturn = oldData?.data?.content?.map((item: User) => {
                    if (item.id === data?.data?.id) {
                        return data?.data;
                    }
                    return item;
                });
                return { ...oldData, data: { content: dataReturn } };
            });
            const dataQuery: any = queryClient.getQueryData(['users']);
            if (dataQuery?.data?.content?.length > 0) {
                setInitialRecords([...sortBy(dataQuery?.data.content, 'username')]);
            }

            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    const submitForm = () => {
        changeUserStatusMutation(userId);
    };

    const {
        data: rowData,
        isFetching,
        isLoading,
    } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
        // staleTime: 50000,
        onSuccess: (data) => {
            if (data?.data?.content) {
                // console.log('vo day roi nha', [...sortBy(data.data.content, 'username')]);

                setInitialRecords([...sortBy(data.data.content, 'username')]);
            }
        },
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...sortBy(
                    rowData?.data.content.filter((item: User) => {
                        return (
                            item?.username?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.email?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.role?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.phone?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.isActive?.toString().toLowerCase().includes(search.toLowerCase())
                        );
                    }),
                    'username'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    //     setPage(1);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sortStatus]);

    const columns: DataTableColumn<User>[] = useMemo(
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
                accessor: 'username',
                title: 'Username',
                sortable: true,
            },
            { accessor: 'balanceG', title: 'Số dư G', sortable: true },
            { accessor: 'balanceP', title: 'Số dư P', sortable: true },
            { accessor: 'totalDeposit', title: 'Tổng tiền nạp', sortable: true },
            {
                accessor: 'role',
                title: 'Vai trò',
                sortable: true,
                render: ({ role }) => {
                    return role === ROLES.ADMIN ? (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge badge-outline-danger rounded-full">Admin</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge badge-outline-info rounded-full">User</span>
                        </div>
                    );
                },
            },
            {
                accessor: 'isActive',
                title: 'Trạng thái',
                sortable: true,
                render: ({ isActive }) => {
                    return isActive ? (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-success rounded-full">Hoạt động</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-danger rounded-full">Bị khóa</span>
                        </div>
                    );
                },
            },
            {
                accessor: 'action',
                title: 'Thao tác',
                sortable: false,
                render: ({ id, isActive }) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Tippy content="Chỉnh sửa">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`${AdminRoutes.USER}/${id}`);
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

                            <Tippy content={isActive ? 'Tắt hoạt động' : 'Mở hoạt động'}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserId(id ? id : '');
                                        setOpenConfirmModal(true);
                                    }}
                                >
                                    <svg className="m-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            opacity="0.5"
                                            d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path
                                            d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </Tippy>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <>
            <CustomDataTable<User>
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={'Nguoi dung'}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />

            {openConfirmModal ? (
                <ConfirmModal handleSubmit={submitForm} data={'sdfsdfsdf'} message={'Bạn có chắc chắn muốn không?'} title={'sfd'} isOpen={true} setIsOpen={setOpenConfirmModal} />
            ) : null}
        </>
    );
};

export default DashboardTemp;
