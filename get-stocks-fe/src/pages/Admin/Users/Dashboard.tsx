import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { getAllUsers, changeUserStatus } from '../../../services/userService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ROLES, User } from '../../../types/user';
import { ConfirmModal } from '../../../components';
import { useNavigate } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../utils/formatDate';

const Dashboard = () => {
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle(t('users')));
    }, []);

    const [initialRecords, setInitialRecords] = useState<User[]>([]);
    const [userId, setUserId] = useState<string>('');

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'updatedAt',
        direction: 'desc',
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
                setInitialRecords([...orderBy(dataQuery?.data.content, 'username')]);
            }

            toast.success(t('update_success'));
        },
        onError: (error: any) => {
            toast.error(error?.message || t('has_error'));
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
                setInitialRecords([...orderBy(data.data.content, 'username', 'desc')]);
            }
        },
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
                    'username',
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
                            <Tippy content={t('click_to_copy')} data-placement="top">
                                <p
                                    onClick={() => {
                                        navigator.clipboard.writeText(id || '');
                                    }}
                                    className="hover:cursor-pointer"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                                            stroke="currentColor"
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
            { accessor: 'balanceG', title: 'G', sortable: true },
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
                accessor: 'role',
                title: t('role'),
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
                accessor: 'lastLogin',
                title: 'Lần cuối HĐ',
                sortable: true,
                render: ({ lastLogin }) => {
                    return formatDateTime(lastLogin);
                },
            },
            {
                accessor: 'isActive',
                title: t('status'),
                sortable: true,
                render: ({ isActive }) => {
                    return isActive ? (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-success rounded-full">{t('status_active')}</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-1/2">
                            <span className="badge bg-danger rounded-full">{t('status_disabled')}</span>
                        </div>
                    );
                },
            },
            {
                accessor: 'action',
                title: t('action'),
                sortable: false,
                render: ({ id, isActive }) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Tippy content={t('edit')}>
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

                            <Tippy content={isActive ? t('change_status_disabled') : t('change_status_active')}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserId(id ? id : '');
                                        setOpenConfirmModal(true);
                                    }}
                                >
                                    {isActive ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path d="M6 10V8C6 4.68629 8.68629 2 12 2C14.7958 2 17.1449 3.91216 17.811 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </button>
                            </Tippy>
                        </div>
                    );
                },
            },
        ],
        [t]
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
                title={t('users')}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />

            {openConfirmModal ? <ConfirmModal handleSubmit={submitForm} data={''} message={t('confirm_submit')} title={t('confirm_update')} isOpen={true} setIsOpen={setOpenConfirmModal} /> : null}
        </>
    );
};

export default Dashboard;
