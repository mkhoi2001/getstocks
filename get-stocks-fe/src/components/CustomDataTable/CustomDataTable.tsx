import { Dispatch, useEffect, useState, SetStateAction } from 'react';
import { DataTable, DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';

type Props<T> = {
    title?: string;
    sortStatus: DataTableSortStatus;
    setSortStatus: Dispatch<SetStateAction<DataTableSortStatus>>;
    isFetching?: boolean;
    isLoading?: boolean;
    columns: DataTableColumn<T>[];
    initialRecords: T[];
    setInitialRecords: Dispatch<SetStateAction<T[]>>;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    enableAdd: boolean;
    setAddNew?: Dispatch<SetStateAction<boolean>>;
};

export const CustomDataTable = <T extends {}>({
    setAddNew,
    enableAdd,
    search,
    setSearch,
    isLoading,
    setInitialRecords,
    initialRecords = [],
    setSortStatus,
    columns,
    sortStatus,
    isFetching,
    title,
}: Props<T>) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords?.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    return (
        <div className="panel">
            <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                <div className="flex gap-2">
                    <h5 className="font-semibold text-lg dark:text-white-light">{title}</h5>
                    {enableAdd ? (
                        <button onClick={() => (setAddNew ? setAddNew(true) : null)} type="button" className="btn btn-info">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            {t('add_new')}
                        </button>
                    ) : (
                        ''
                    )}
                </div>
                <div className="ltr:ml-auto rtl:mr-auto">
                    <input type="text" className="form-input w-auto" placeholder={t('searching')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover"
                    records={recordsData}
                    columns={columns}
                    totalRecords={initialRecords?.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={(p) => setPage(p)}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `  ${from} - ${to} / ${totalRecords} `}
                    loaderVariant="oval"
                    loaderColor="blue"
                    loaderBackgroundBlur={1}
                    fetching={isLoading}
                    noRecordsText={t('no_records')}
                />
            </div>
        </div>
    );
};

export default CustomDataTable;
