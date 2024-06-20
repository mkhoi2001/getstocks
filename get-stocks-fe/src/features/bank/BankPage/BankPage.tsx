import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBanks, changeBankStatus } from '../../../services/bankService';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useEffect, useMemo, useState } from 'react';
import { Bank } from '../../../types/bank';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import orderBy from 'lodash/orderBy';
import Tippy from '@tippyjs/react';
import { CustomDataTable } from '../../../components';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import { ConfirmModal } from '../../../components';
import toast from 'react-hot-toast';

type Props = {};

export const BankPage = (props: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch(setPageTitle('Ngân hàng'));
    });

    const [initialRecords, setInitialRecords] = useState<Bank[]>([]);
    const [bank, setBank] = useState<Bank | undefined>(undefined);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'updatedAt',
        direction: 'desc',
    });

    const {
        data: rowData,
        isFetching,
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ['banks'],
        queryFn: getAllBanks,
        staleTime: Infinity,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'name', 'desc')]);
            }
        },
    });

    const {
        mutate: changeBankStatusMutation,
        isLoading: isLoadingChangeStatus,
        isSuccess: isSuccessChangeStatus,
    } = useMutation({
        mutationFn: changeBankStatus,
        onSuccess: (data) => {
            toast.success('Cập nhật bank thành công');
            refetch();
        },
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    rowData?.data.content.filter((item: Bank) => {
                        return (
                            item?.bankName?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.host?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.id?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.username?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.cardNumber?.toLowerCase().includes(search.toLowerCase())
                        );
                    }),
                    'updatedAt',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const submitFormUpdate = () => {
        changeBankStatusMutation(bank?.id);
    };

    const columns: DataTableColumn<Bank>[] = useMemo(
        () => [
            {
                accessor: 'id',
                title: 'ID',
                sortable: true,
                render: ({ id }) => {
                    return (
                        <>
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
                        </>
                    );
                },
            },
            {
                accessor: 'bankName',
                title: 'Tên ngân hàng',
                sortable: true,
            },
            { accessor: 'cardNumber', title: 'Số thẻ', sortable: true },
            { accessor: 'username', title: 'Tên chủ thẻ', sortable: true },
            { accessor: 'bankcode', title: 'Bankcode', sortable: true },
            // { accessor: 'host', title: 'API', sortable: true },

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
                            <span className="badge bg-danger rounded-full">Khóa</span>
                        </div>
                    );
                },
            },
            {
                accessor: 'action',
                title: 'Thao tác',
                sortable: false,
                render: (currentBank) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Tippy content="Chỉnh sửa">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`${AdminRoutes.BANK}/${currentBank.id}`);
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

                            <Tippy content={currentBank.isActive ? 'Tạm dừng' : 'Hoạt động'}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBank(currentBank ? currentBank : undefined);
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
        <div>
            <div>
                <CustomDataTable<Bank>
                    initialRecords={initialRecords}
                    search={search}
                    setSearch={setSearch}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    columns={columns}
                    setInitialRecords={setInitialRecords}
                    title={'Ngân hàng'}
                    sortStatus={sortStatus}
                    setSortStatus={setSortStatus}
                    enableAdd={false}
                />
                <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                    {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                    Reload
                </button>
                {openConfirmModal ? (
                    <ConfirmModal
                        handleSubmit={submitFormUpdate}
                        data={
                            <div>
                                <p> Ngân hàng: {bank?.bankName} </p>
                                <p> Số thẻ: {bank?.cardNumber} </p>
                                <p> Tên: {bank?.username} </p>
                            </div>
                        }
                        message={'Thay đổi trạng thái ngân hàng'}
                        title={'Bạn có chắc chắn muốn thực hiện hành động này?'}
                        isOpen={true}
                        setIsOpen={setOpenConfirmModal}
                    />
                ) : null}
            </div>
        </div>
    );
};

export default BankPage;
