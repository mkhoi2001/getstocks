import { DataTable, DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import { getAllStocks, deleteStock, changeStockStatus } from '../../../services/stockService';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import { Stock } from '../../../types/stock';
import { CustomDataTable } from '../../../components';
import { StockForm } from './Components';
import toast from 'react-hot-toast';
import { createStock } from '../../../services/stockService';
import { ConfirmModal } from '../../../components';
import { useTranslation } from 'react-i18next';

type Props = {};

const Dashboard = (props: Props) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const queryClient = new QueryClient();
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch(setPageTitle(t('stocks')));
    });

    const [initialRecords, setInitialRecords] = useState<Stock[]>([]);
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [stock, setStock] = useState<Stock | undefined>(undefined);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'updatedAt',
        direction: 'asc',
    });

    const {
        mutate: createStockMutation,
        isLoading: isLoadingCreate,
        isSuccess,
    } = useMutation({
        mutationFn: createStock,
        onSuccess: (data) => {
            toast.success(t('create_stock'));
            setIsAdded(false);
            queryClient.invalidateQueries(['stocks']);
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const {
        mutate: deleteStockMutation,
        isLoading: isLoadingDelete,
        isSuccess: isSuccessDelete,
    } = useMutation({
        mutationFn: deleteStock,
        onSuccess: (data) => {
            toast.success(t('delete_stock'));
            refetch();
        },
    });

    const {
        mutate: changeStockStatusMutation,
        isLoading: isLoadingChangeStatus,
        isSuccess: isSuccessChangeStatus,
    } = useMutation({
        mutationFn: changeStockStatus,
        onSuccess: (data) => {
            toast.success(t('updated_stock'));
            refetch();
            // queryClient.invalidateQueries({ queryKey: ['stocks'] });
        },
    });

    const {
        data: rowData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['stocks'],
        queryFn: getAllStocks,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'updatedAt', 'desc')]);
            }
        },
    });

    const submitFormChange = () => {
        changeStockStatusMutation(stock?.id);
    };

    const submitFormDelete = () => {
        deleteStockMutation(stock?.id);
    };

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    rowData?.data.content.filter((item: Stock) => {
                        return (
                            item?.name?.toLowerCase().includes(search.toLowerCase()) || item?.host?.toLowerCase().includes(search.toLowerCase())
                            // item?.stockTypes?.filter((stockType) => stockType?.price?.toString().toLowerCase().includes(search.toLowerCase()))
                        );
                    }),
                    'updatedAt',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<Stock>[] = useMemo(
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
                title: t('name'),
                sortable: true,
            },
            { accessor: 'host', title: t('host'), sortable: true },
            { accessor: 'pathName', title: 'Đường dẫn con', sortable: true },
            {
                accessor: 'stockTypes',
                title: t('price_g'),
                sortable: true,
                render: ({ stockTypes }) => {
                    const typeG = stockTypes?.find((stockType) => stockType.type == 'G');
                    return <span>{typeG?.price}</span>;
                },
            },
            {
                accessor: 'stockTypes-P',
                title: t('price_p'),
                sortable: true,
                render: ({ stockTypes }) => {
                    const typeG = stockTypes?.find((stockType) => stockType.type == 'P');
                    return <span>{typeG?.price}</span>;
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
                            <span className="badge bg-danger rounded-full">{t('status_lock')}</span>
                        </div>
                    );
                },
            },
            {
                accessor: 'action',
                title: t('action'),
                sortable: false,
                render: (currentStock) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Tippy content="Chỉnh sửa">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`${AdminRoutes.STOCK}/${currentStock.id}`);
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

                            <Tippy content={currentStock.isActive ? t('change_status_disabled') : t('change_status_active')}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStock(currentStock ? currentStock : undefined);
                                        setOpenStatusModal(true);
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </Tippy>

                            <Tippy content={t('delete')}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStock(currentStock ? currentStock : undefined);
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
        [t]
    );

    return (
        <div>
            {isAdded ? (
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <button onClick={() => setIsAdded(false)} className="hover:cursor-pointer">
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="pt-5 p-2">
                        <StockForm isSuccess={isSuccess} isLoading={isLoadingCreate} mutation={createStockMutation} isNew={true} />
                    </div>
                </div>
            ) : (
                <div>
                    <CustomDataTable<Stock>
                        initialRecords={initialRecords}
                        search={search}
                        setSearch={setSearch}
                        isFetching={isFetching}
                        isLoading={isLoading}
                        columns={columns}
                        setInitialRecords={setInitialRecords}
                        title={t('stocks')}
                        sortStatus={sortStatus}
                        setSortStatus={setSortStatus}
                        enableAdd={true}
                        setAddNew={setIsAdded}
                    />
                    <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                        {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                        {t('reload')}
                    </button>
                    {openConfirmModal ? (
                        <ConfirmModal
                            handleSubmit={submitFormDelete}
                            data={
                                <div>
                                    <p> StockId: {stock?.id} </p>
                                    <p>
                                        {t('name')}: {stock?.name}
                                    </p>
                                </div>
                            }
                            message={t('confirm_delete_stock')}
                            title={t('confirm_submit')}
                            isOpen={true}
                            setIsOpen={setOpenConfirmModal}
                        />
                    ) : null}

                    {openStatusModal ? (
                        <ConfirmModal
                            handleSubmit={submitFormChange}
                            data={
                                <div>
                                    <p> StockId: {stock?.id} </p>
                                    <p>
                                        {t('name')}: {stock?.name}
                                    </p>
                                </div>
                            }
                            message={t('change_status_stock')}
                            title={t('confirm_submit')}
                            isOpen={true}
                            setIsOpen={setOpenStatusModal}
                        />
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
