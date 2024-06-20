import React from 'react';
import { getAllGetStockItems, updateGetStockItemStatus } from '../../../services/stockService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { GetStockItem } from '../../../types/stock';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import 'tippy.js/dist/tippy.css';
import { ConfirmModal, CustomDataTable } from '../../../components';
import orderBy from 'lodash/orderBy';
import toast from 'react-hot-toast';
import { AdminRoutes } from '../../../router/routes';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '../../../store';
import { useSelector } from 'react-redux';

const Provider = () => {
    const { t } = useTranslation();
    const [initialRecords, setInitialRecords] = React.useState<GetStockItem[]>([]);
    const [stock, setStock] = React.useState<GetStockItem | undefined>(undefined);
    const [openConfirmModal, setOpenConfirmModal] = React.useState<boolean>(false);
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);

    const navigate = useNavigate();

    const [search, setSearch] = React.useState('');
    const [sortStatus, setSortStatus] = React.useState<DataTableSortStatus>({
        columnAccessor: 'updatedAt',
        direction: 'asc',
    });

    const {
        data: rowData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['stockProvider'],
        queryFn: getAllGetStockItems,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'updatedAt', 'desc')]);
            }
        },
    });

    const {
        mutate: changeStockStatusMutation,
        isLoading: isLoadingChangeStatus,
        isSuccess: isSuccessChangeStatus,
    } = useMutation({
        mutationFn: updateGetStockItemStatus,
        onSuccess: (data) => {
            toast.success(t('updated_stock'));
            refetch();
        },
        onError: (err: any) => {
            toast.error(err?.message || err);
        },
    });

    const handleChangeStatus = () => {
        changeStockStatusMutation({ id: stock?.id, status: !stock?.status });
    };

    const columns: DataTableColumn<GetStockItem>[] = [
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
        {
            accessor: 'host',
            title: t('host'),
            sortable: true,
        },
        {
            accessor: 'price',
            title: t('price'),
            sortable: true,
        },
        {
            accessor: 'price_vnd',
            title: 'Giá VND',
            sortable: true,
            render: ({ price }: { price: any }) => {
                return (
                    <p>
                        {price
                            ? (Math.ceil((price * parseFloat(systemConfig.usd_vnd)) / 100) * 100).toLocaleString('vi-VN', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                              })
                            : 0}{' '}
                    </p>
                );
            },
        },
        {
            accessor: 'typePack',
            title: t('type_pack'),
            sortable: true,
            render: ({ typePack }) => {
                switch (typePack) {
                    case 'G':
                        return 'Tiết kiệm';
                        break;
                    case 'P':
                        return 'Thường xuyên';
                        break;
                    default:
                        return 'Tất cả gói';
                }
            },
        },
        {
            accessor: 'status',
            title: t('status'),
            sortable: true,
            render: ({ status }) => {
                return status ? (
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
            render: (curStock) => {
                return (
                    <div className="flex items-center gap-2">
                        <Tippy content="Chỉnh sửa">
                            <button
                                type="button"
                                onClick={() => {
                                    navigate(`${AdminRoutes.GET_STOCK_PROV}/${curStock.id}`);
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
                        <Tippy content={curStock?.status ? t('change_status_disabled') : t('change_status_active')}>
                            <button
                                type="button"
                                onClick={() => {
                                    setStock(curStock ? curStock : undefined);
                                    setOpenConfirmModal(true);
                                }}
                            >
                                {curStock?.status ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    ];

    return (
        <>
            <CustomDataTable<GetStockItem>
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
                enableAdd={false}
            />
            <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                {t('reload')}
            </button>
            {openConfirmModal ? (
                <ConfirmModal
                    handleSubmit={handleChangeStatus}
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
                    setIsOpen={setOpenConfirmModal}
                />
            ) : null}
        </>
    );
};

export default Provider;
