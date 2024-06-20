import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { DataTable, DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { PackageType } from '../../../types/stock';
import { IRootState } from '../../../store';
import { useSelector } from 'react-redux';

type Props = {
    items: any;
    isLoading: boolean;
    tabType: PackageType;
};

export const ItemList = ({ items = [], isLoading, tabType }: Props) => {
    const { t } = useTranslation();

    const [initialRecords, setInitialRecords] = useState<any>(items);
    const [search, setSearch] = useState('');
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);

    useEffect(() => {
        if (items?.length) {
            setInitialRecords([...items]);
        }
    }, [items]);

    useEffect(() => {
        setInitialRecords(() => {
            if (!search) {
                return [...items];
            }

            return [
                ...items?.filter((item: any) => {
                    return item?.name?.toLowerCase().includes(search.toLowerCase());
                }),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const columns = [
        // {
        //     accessor: 'stt',
        //     title: t('stt'),
        //     sortable: true,
        // },
        {
            accessor: 'name',
            title: t('package_name'),
            sortable: true,
        },
        {
            accessor: 'accessor',
            title: t('price'),
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
                        {tabType == PackageType.G ? 'G' : 'P'}
                    </p>
                );
            },
            // render: ({ stockTypes }: { stockTypes: any }) => {
            //     return (
            //         <p>
            //             {stockTypes[0]?.price} {tabType === PackageType.G ? 'G' : 'P'}
            //         </p>
            //     );
            // },
        },
    ];

    return (
        <div>
            <div className="flex flex col">
                <div className="my-3 mr-auto">
                    <input type="text" className="form-input w-auto" placeholder={t('searching')} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover"
                    records={initialRecords}
                    columns={columns}
                    totalRecords={items?.length}
                    minHeight={200}
                    loaderVariant="oval"
                    loaderColor="blue"
                    loaderBackgroundBlur={1}
                    height={300}
                    fetching={isLoading}
                    noRecordsText={t('no_records')}
                />
            </div>
        </div>
    );
};

export default ItemList;
