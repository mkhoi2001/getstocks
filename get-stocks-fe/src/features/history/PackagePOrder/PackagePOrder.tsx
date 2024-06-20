import sortBy from 'lodash/sortBy';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../components';
import { formatDate } from '../../../utils/formatDate';
import { getPackageOrderByUserId } from '../../../services/paymentService';
import { PackageOrder } from '../../../types/package';
import { useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';

type Props = {};

export const PackagePOrder = (props: Props) => {
    const [initialRecords, setInitialRecords] = useState<PackageOrder[]>([]);
    const { t } = useTranslation();

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'expireTime',
        direction: 'asc',
    });
    const {
        data: rowData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['packageOrders'],
        queryFn: getPackageOrderByUserId,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...sortBy(data.data.content, 'packageType')]);
            }
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...sortBy(
                    rowData?.data.content.filter((item: PackageOrder) => {
                        return (
                            item?.expireTime?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item?.dailyLeft?.toString().includes(search.toLowerCase()) ||
                            item?.createdAt?.toString().includes(search.toLowerCase()) ||
                            item?.updatedAt?.toString().includes(search.toLowerCase())
                        );
                    }),
                    'name'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<PackageOrder>[] = useMemo(
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
                accessor: 'dailyLeft',
                title: t('days_using'),
                sortable: true,
            },
            {
                accessor: 'expireTime',
                title: t('days_using'),
                sortable: true,
                render: ({ expireTime }) => {
                    return (
                        <>
                            <div>{formatDate(expireTime)}</div>
                        </>
                    );
                },
            },
            {
                accessor: 'createdAt',
                title: t('date_order'),
                sortable: true,
                render: ({ createdAt }) => {
                    return (
                        <>
                            <div>{formatDate(createdAt)}</div>
                        </>
                    );
                },
            },
            // {
            //     accessor: 'updatedAt',
            //     title: 'So ngay sd',
            //     sortable: true,
            //     render: ({ updatedAt }) => {
            //         return (
            //             <>
            //                 <div>{formatDate(updatedAt)}</div>
            //             </>
            //         );
            //     },
            // },
        ],
        [t]
    );

    return (
        <div>
            <CustomDataTable<PackageOrder>
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={t('package_p')}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
            <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                {t('reload')}
            </button>
        </div>
    );
};

export default PackagePOrder;
