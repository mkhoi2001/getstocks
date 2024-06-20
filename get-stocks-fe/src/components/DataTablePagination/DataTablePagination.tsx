import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { useInfiniteQuery, QueryClient } from '@tanstack/react-query';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

type TableProps<T> = {
    columns: DataTableColumn<T>[];
    queryFn: any;
};

export const DataTablePagination = <T extends {}>({ columns, queryFn }: TableProps<T>) => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [2, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<T[]>([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const queryClient = new QueryClient();

    const {
        data: dataPagination,
        fetchNextPage,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ['users'],
        queryFn: ({ pageParam }) => {
            console.log('pagesize ', pageSize);
            return queryFn({ page: pageParam, limit: pageSize });
        },
        getNextPageParam: (lastPage, pages) => {
            // console.log('getNextPage', lastPage, pages);
            return +lastPage?.data.nextPage;
        },
    });

    useEffect(() => {
        setPage(1);
        queryClient.invalidateQueries();
    }, [pageSize]);

    useEffect(() => {
        // const from = (page - 1) * pageSize;
        // const to = from + pageSize;
        // setRecordsData([...initialRecords.slice(from, to)]);
        // if (dataUsers?.pages?.length) {
        //     const dataFilter = dataUsers?.pages?.find((dataPage) => dataPage?.data?.page === page - 1);
        //     console.log('data find ', dataFilter, page - 1);
        //     if (dataFilter) {
        //         setRecordsData([...dataFilter?.data?.content]);
        //     }
        // }

        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        if (dataPagination?.pages?.length) {
            const result = dataPagination?.pages?.reduce((acc: any, page: any) => {
                return acc.concat(page?.data?.content);
            }, []);
            console.log('result  ', result);
            setInitialRecords(sortBy(result, 'username'));
            setRecordsData(initialRecords);
        }
    }, [dataPagination]);

    const fetchDataOnPage = (page: number): void => {
        if (dataPagination?.pages?.length) {
            const pageIsExits = dataPagination?.pages.some((dataPerPage) => dataPerPage?.data.page === page);
            if (!pageIsExits) {
                fetchNextPage({ pageParam: page });
            }
        }
    };

    return (
        <div className="datatables">
            <DataTable
                highlightOnHover
                className="whitespace-nowrap table-hover"
                records={recordsData}
                columns={columns}
                totalRecords={dataPagination?.pages[0]?.data?.total ? dataPagination.pages[0]?.data?.total : 0}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => {
                    console.log('page changed', p);
                    setPage(p);
                    fetchDataOnPage(p - 1);
                    // fetchNextPage({ pageParam: p - 1 });
                }}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                // sortStatus={sortStatus}
                // onSortStatusChange={setSortStatus}
                minHeight={200}
                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    );
};

export default DataTablePagination;
