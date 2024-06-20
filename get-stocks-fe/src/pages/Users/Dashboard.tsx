import { Tab } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllStockTypeG, getAllStockTypeP, getAllActiveStocks } from '../../services/stockService';
import * as Yup from 'yup';
import { FormDown, ItemList } from '../../features/item';
import { downloadItemTypeG, downloadItemTypeP } from '../../services/itemService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { TabItemList } from '../../features/item';
import { useTranslation } from 'react-i18next';
import { Box, PanelDownload, TabDownload } from '../../features/user';
import { ItemNews, OrderNews } from '../../features/news';
import { ENV_CONFIG } from '../../utils/const';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import parse from 'html-react-parser';
import { PackageType } from '../../types/stock';

type Props = {};

const Dashboard = (props: Props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { t } = useTranslation();

    const user = useSelector((state: IRootState) => state.user.data.info);
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);

    const { data: stockGData, isFetching: isLoadingG } = useQuery({
        queryKey: ['stocks-g'],
        queryFn: getAllStockTypeG,
        staleTime: 60000,
        onSuccess: (data) => {},
    });

    const { data: stockPData, isFetching: isLoadingP } = useQuery({
        queryKey: ['stocks-p'],
        queryFn: getAllStockTypeP,
        staleTime: 60000,
        onSuccess: (data) => {},
    });

    return (
        <div>
            <div>
                <Box />
            </div>
            {systemConfig?.guide_box ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 mb-3 gap-4">
                    <div className="drop-shadow-md w-full panel">{parse(systemConfig?.guide_box)}</div>
                </div>
            ) : (
                ''
            )}
            <div className="">
                <div className=" gap-6 mb-6 justify-center flex flex-col">
                    <div className="max-w-[100%] w-full  mx-auto flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className={`drop-shadow-md w-full mx-auto panel h-full col-span-3 ${systemConfig?.banner ? 'sm:col-span-2' : ''}  `}>
                                <div className="flex gap-3">
                                    {/* <p className="font-bold text-red-500 text-xl">G: {user?.balanceG?.toFixed(2)}</p> */}
                                    {/* <p className="font-bold text-red-500 text-xl">P: {user?.balanceP?.toFixed(2)}</p> */}
                                    <p className="font-bold text-red-500 text-xl">
                                        G:{' '}
                                        {user?.balanceG
                                            ? Math.ceil(user?.balanceG * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                                  //   style: 'currency',
                                                  //   currency: 'VND',
                                                  minimumFractionDigits: 0,
                                                  maximumFractionDigits: 2,
                                              })
                                            : 0}
                                    </p>
                                    <p className="font-bold text-red-500 text-xl">
                                        P:{' '}
                                        {user?.balanceP
                                            ? Math.ceil(user?.balanceP * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                                  //   style: 'currency',
                                                  //   currency: 'VND',
                                                  minimumFractionDigits: 0,
                                                  maximumFractionDigits: 2,
                                              })
                                            : 0}
                                    </p>
                                </div>
                                <div className="mb-2">
                                    <TabDownload selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                                    <div className="mt-4">
                                        {selectedIndex === 0 ? (
                                            <ItemList isLoading={isLoadingG} tabType={PackageType.G} items={stockGData?.data?.content} />
                                        ) : (
                                            <ItemList isLoading={isLoadingP} tabType={PackageType.P} items={stockPData?.data?.content} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            {systemConfig?.banner && (
                                <div className="panel col-span-3 sm:col-span-1">
                                    <PerfectScrollbar className="h-full">{parse(systemConfig?.banner)}</PerfectScrollbar>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="drop-shadow-lg w-full panel">
                                <OrderNews />
                            </div>
                            <div className="drop-shadow-lg w-full panel">
                                <ItemNews />
                            </div>
                            {/* <div className=" drop-shadow-lg w-full panel">
                                <TabItemList />
                            </div>
                            <div className="h-full flex flex-col gap-3">
                                <div className=" flex-1 grid grid-cols-1 sm:grid-cols-1 drop-shadow-lg w-full panel">
                                    <OrderNews />
                                </div>
                                <div className=" flex-1 grid grid-cols-1 sm:grid-cols-1 drop-shadow-lg w-full panel">
                                    <ItemNews />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
