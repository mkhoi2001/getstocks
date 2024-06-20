import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllPackageP, createPackageP, deletePackageP } from '../../../services/packageService';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import { PackagePricingP } from '../../../types/package';
import { CustomDataTable } from '../../../components';
import { PackagePForm } from './Components';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../../components';

type Props = {};

const Dashboard = (props: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        dispatch(setPageTitle('Gói thường xuyên'));
    });
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [packageId, setPackageId] = useState<string>('');
    const [initialRecords, setInitialRecords] = useState<PackagePricingP[]>([]);
    const [isAdded, setIsAdded] = useState<boolean>(false);

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
        queryKey: ['packageP'],
        queryFn: getAllPackageP,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'updatedAt', 'desc')]);
            }
        },
    });

    const {
        mutate: createPackagePMutation,
        isLoading: isLoadingCreate,
        isSuccess,
    } = useMutation({
        mutationFn: createPackageP,
        onSuccess: (data) => {
            toast.success('Tạo mới stock thành công');
            setIsAdded(false);
            // refetch();
            queryClient.invalidateQueries({ queryKey: ['packageP'] });
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const { mutate: deletePackagePMutation } = useMutation({
        mutationFn: deletePackageP,
        onSuccess: (data) => {
            refetch();
            toast.success('Xoá thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    const submitFormDelete = () => {
        deletePackagePMutation(packageId);
    };

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    rowData?.data.content.filter((item: PackagePricingP) => {
                        return (
                            item?.name?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.price?.toString().includes(search.toLowerCase()) ||
                            item?.dayExpires?.toString().includes(search.toLowerCase()) ||
                            item?.downPerDay?.toString().includes(search.toLowerCase())
                        );
                    }),
                    'updatedAt',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<PackagePricingP>[] = useMemo(
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
                title: 'Tên',
                sortable: true,
            },
            {
                accessor: 'price',
                title: 'Giá',
                sortable: true,
                render: ({ price }) => {
                    const formattedNumber = price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 });
                    return formattedNumber;
                },
            },
            {
                accessor: 'dayExpires',
                title: 'Số ngày sử dụng',
                sortable: true,
            },
            {
                accessor: 'downPerDay',
                title: 'Lượt down 1 ngày',
                sortable: true,
            },
            {
                accessor: 'content',
                title: 'Nội dung mua',
                sortable: true,
            },
            {
                accessor: 'action',
                title: 'Thao tác',
                sortable: false,
                render: ({ id }) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Tippy content="Chỉnh sửa">
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate(`${AdminRoutes.PACKAGE_P}/${id}`);
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

                            <Tippy content={'Xoa'}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPackageId(id ? id : '');
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
                        <PackagePForm isSuccess={isSuccess} isLoading={isLoadingCreate} mutation={createPackagePMutation} isNew={true} />
                    </div>
                </div>
            ) : (
                <div>
                    <CustomDataTable<PackagePricingP>
                        initialRecords={initialRecords}
                        search={search}
                        setSearch={setSearch}
                        isFetching={isFetching}
                        isLoading={isLoading}
                        columns={columns}
                        setInitialRecords={setInitialRecords}
                        title={'Gói thường xuyên'}
                        sortStatus={sortStatus}
                        setSortStatus={setSortStatus}
                        enableAdd={true}
                        setAddNew={setIsAdded}
                    />
                    {openConfirmModal ? (
                        <ConfirmModal handleSubmit={submitFormDelete} data={'sdfsdfsdf'} message={'Bạn có chắc chắn muốn không?'} title={'sfd'} isOpen={true} setIsOpen={setOpenConfirmModal} />
                    ) : null}
                    <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                        {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                        Reload
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
