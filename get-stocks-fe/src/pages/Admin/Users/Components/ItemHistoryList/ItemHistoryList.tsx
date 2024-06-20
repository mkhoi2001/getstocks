import Tippy from '@tippyjs/react';
import orderBy from 'lodash/orderBy';
import { DataTableSortStatus, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CustomDataTable } from '../../../../../components';
import { formatDateTime } from '../../../../../utils/formatDate';
import { ItemHistory } from '../../../../../types/item';
import { getItemHistoryListByUserId, reDownloadItem } from '../../../../../services/itemService';
import { useTranslation } from 'react-i18next';
import { ENV_CONFIG } from '../../../../../utils/const';
import { Link } from 'react-router-dom';

type Props = {
    id: string;
};

export const ItemHistoryList = ({ id = '' }: Props) => {
    const [initialRecords, setInitialRecords] = useState<ItemHistory[]>([]);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string>('');

    const { t } = useTranslation();

    const baseAPI = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;

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
        queryKey: ['itemHistory', id],
        queryFn: () => getItemHistoryListByUserId(id),
        enabled: !!id,
        onSuccess: (data) => {
            if (data?.data?.content) {
                setInitialRecords([...orderBy(data.data.content, 'updated', 'desc')]);
            }
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const { mutate: reDownloadItemMutation } = useMutation({
        mutationFn: reDownloadItem,
        onSuccess: (data) => {
            // handleDownload(data?.data);
            handleReadyDownload(data?.data);
        },
        onError: (error: any) => {
            setIsDownloading(false);

            toast.error(error.message);
        },
    });

    const linkRef = useRef<any>(null);

    useEffect(() => {
        if (downloadUrl) {
            linkRef?.current?.click();
        }
    }, [downloadUrl]);

    const handleReadyDownload = (data: any) => {
        const baseAPI = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;
        const downloadUrl = `${baseAPI}/item/down?code=${data?.itemDCode}`;
        // setListItemId((prev) => [...prev, data?.itemDCode]);
        setDownloadUrl(downloadUrl);
        // console.log('downloadUrl ', downloadUrl, listItemId);
        setIsDownloading(false);
        toast.success(t('down_item_success'));
    };

    useEffect(() => {
        setInitialRecords(() => {
            return [
                ...orderBy(
                    rowData?.data.content.filter((item: ItemHistory) => {
                        return (
                            item?.createdAt?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item?.extension?.toString().includes(search.toLowerCase()) ||
                            item?.fileName?.toString().includes(search.toLowerCase()) ||
                            item?.provider?.toString().includes(search.toLowerCase()) ||
                            item?.itemDCode?.toString().includes(search.toLowerCase())
                        );
                    }),
                    'updatedAt',
                    'desc'
                ),
            ];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleDownload = async (item: ItemHistory) => {
        const baseAPI = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;
        const downloadUrl = `${baseAPI}/item/down?code=${item?.itemDCode}`;
        const newTab = window.open(downloadUrl);
        toast.success(t('down_item_success'));
        setIsDownloading(false);
        if (newTab) {
            newTab.onload = () => {
                newTab.location.href = 'about:blank';
            };
        }
    };

    const handleReDownload = async (item: ItemHistory) => {
        reDownloadItemMutation(item.id);
    };

    const columns: DataTableColumn<ItemHistory>[] = useMemo(
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
                accessor: 'fileName',
                title: t('file_name'),
                sortable: true,
            },
            {
                accessor: 'provider',
                title: t('package_name'),
                sortable: true,
            },
            {
                accessor: 'cost',
                title: 'Giá tải',
                sortable: true,
                render: ({ cost }) => {
                    const formattedNumber = cost?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 });
                    return formattedNumber;
                },
            },
            {
                accessor: 'itemDCode',
                title: t('code_item'),
                sortable: true,
            },
            {
                accessor: 'extension',
                title: t('file_type'),
                sortable: true,
            },
            {
                accessor: 'updatedAt',
                title: t('day_download_item'),
                sortable: true,
                render: ({ updatedAt }) => {
                    return (
                        <>
                            <div>{formatDateTime(updatedAt)}</div>
                        </>
                    );
                },
            },
            {
                accessor: 'action',
                title: t('action'),

                sortable: true,
                render: (currentItem) => {
                    const itemUrl = `${baseAPI}/item/down?code=${currentItem?.itemDCode}`;

                    return (
                        <>
                            <button
                                disabled={isDownloading}
                                className={`${isDownloading ? 'opacity-20' : 'opacity-100'} btn btn-info border-success-light bg-gradient-to-r from-green-500 to-green-400`}
                                onClick={() => {
                                    setIsDownloading(true);
                                    handleReDownload(currentItem);
                                }}
                            >
                                {isDownloading ? (
                                    <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                ) : (
                                    ''
                                )}
                                {t('btn_download_item')}
                            </button>
                            <Link ref={linkRef} className={`hidden btn btn-info border-success-light bg-gradient-to-r `} to={itemUrl}>
                                {t('btn_download_item')}
                            </Link>
                        </>
                    );
                },
            },
        ],
        [t]
    );

    return (
        <div>
            <div>
                <CustomDataTable<ItemHistory>
                    initialRecords={initialRecords}
                    search={search}
                    setSearch={setSearch}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    columns={columns}
                    setInitialRecords={setInitialRecords}
                    title={t('item_download_history')}
                    sortStatus={sortStatus}
                    setSortStatus={setSortStatus}
                    enableAdd={false}
                />
                <button onClick={() => refetch()} type="button" className={`${isFetching ? 'opacity-20' : 'opacity-100'} btn btn-info !mt-6`}>
                    {isFetching ? <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span> : ''}
                    {t('reload')}
                </button>
            </div>
        </div>
    );
};

export default ItemHistoryList;
