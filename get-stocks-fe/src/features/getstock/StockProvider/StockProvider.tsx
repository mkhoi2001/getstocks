import { useState, useEffect, useMemo } from 'react';
import { System } from '../../../types/system';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProviders } from '../../../services/getStockService';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Provider } from './types/provider';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { CustomDataTable } from '../../../components';

type Props = {
    system?: System;
};

export const StockProvider = ({ system }: Props) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [initialRecords, setInitialRecords] = useState<Provider[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'provName',
        direction: 'asc',
    });

    useEffect(() => {
        dispatch(setPageTitle('Item'));
    }, []);

    const {
        data: providersData,
        isFetching,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['getstocksProvider'],
        queryFn: () => getProviders(system?.id),
        enabled: !!system,
        staleTime: Infinity,
        onSuccess: (data) => {
            const providers: Provider[] = [];
            let id = 0;
            data?.data?.norProvider.forEach((provider: any) => {
                providers.push({
                    id: ++id,
                    isSupport: false,
                    ...provider,
                });
            });
            data?.data?.preProvider.forEach((provider: any) => {
                providers.push({
                    id: ++id,
                    isSupport: true,
                    ...provider,
                });
            });
            queryClient.setQueryData(['getstocksProvider'], { data: providers });
            setInitialRecords([...sortBy(providers, 'provName')]);
        },
    });

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...sortBy(
                    providersData?.data?.filter((item: Provider) => {
                        return (
                            item?.provName?.toLowerCase().includes(search.toLowerCase()) ||
                            item?.id?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item?.provHost?.toString().includes(search.toLowerCase()) ||
                            item?.provType?.toString().includes(search.toLowerCase()) ||
                            item?.provPrice?.toString().includes(search.toLowerCase()) ||
                            item?.isPremium?.toString().includes(search.toLowerCase()) ||
                            item?.isAPIAccess?.toString().includes(search.toLowerCase())
                        );
                    }),
                    'name'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns: DataTableColumn<Provider>[] = useMemo(
        () => [
            {
                accessor: 'id',
                title: 'Tên',
                sortable: true,
            },
            {
                accessor: 'provName',
                title: 'Tên',
                sortable: true,
            },
            {
                accessor: 'provPrice',
                title: 'Gía tải',
                sortable: true,
            },
            {
                accessor: 'provHost',
                title: 'Host',
                sortable: true,
            },
            {
                accessor: 'provType',
                title: 'Loại',
                sortable: true,
            },
            {
                accessor: 'isPremium',
                title: 'isPreminum',
                sortable: true,
            },
            {
                accessor: 'isAPIAccess',
                title: 'API gọi được',
                sortable: true,
            },
        ],
        []
    );

    return (
        <div>
            <CustomDataTable
                initialRecords={initialRecords}
                search={search}
                setSearch={setSearch}
                isFetching={isFetching}
                isLoading={isLoading}
                columns={columns}
                setInitialRecords={setInitialRecords}
                title={'Items getstocks hỗ trợ'}
                sortStatus={sortStatus}
                setSortStatus={setSortStatus}
                enableAdd={false}
            />
            <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                Reload
            </button>
        </div>
    );
};

export default StockProvider;
