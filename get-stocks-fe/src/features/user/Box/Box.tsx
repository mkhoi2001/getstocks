import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { useTranslation } from 'react-i18next';
import { getOverviewItemByUserId, getOverviewOrderByUserId } from '../../../services/userService';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatDateTime } from '../../../utils/formatDate';

type Props = {};

export const Box = (props: Props) => {
    const { t } = useTranslation();
    const user = useSelector((state: IRootState) => state.user.data.info);
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);
    const { error: errorItem, data: dataItem }: { data: any; error: any } = useQuery({
        queryKey: ['overviewItems', user?.id],
        enabled: !!user?.id,
        queryFn: getOverviewItemByUserId,
    });

    const { error: errorOrder, data: dataOrder }: { data: any; error: any } = useQuery({
        queryKey: ['overviewOrders', user?.id],
        enabled: !!user?.id,
        queryFn: getOverviewOrderByUserId,
    });

    return (
        <>
            {errorItem ? errorItem?.message : ''}
            {dataOrder ? errorOrder?.message : ''}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{t('num_files_down')}</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center mt-5 ">
                        <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {dataItem?.data?.total}</div>
                        <div className="mx-auto flex flex-col ">
                            <div className="badge bg-white/30  flex items-center font-semibold ">
                                {t('this_month')} {dataItem?.data?.month}
                            </div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">
                                {t('this_week')} {dataItem?.data?.week}
                            </div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">
                                {t('today')} {dataItem?.data?.day}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sessions */}
                <div className="panel  bg-gradient-to-r from-violet-500 to-violet-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{t('balance')}</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className=" items-center mt-3">
                        {/* <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3">G: {user?.balanceG?.toFixed(2)} </div>
                        <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3">P: {user?.balanceP?.toFixed(2)} </div> */}
                        <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3">
                            G:{' '}
                            {user?.balanceG
                                ? Math.ceil(user?.balanceG * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                      //   style: 'currency',
                                      //   currency: 'VND',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                  })
                                : 0}{' '}
                        </div>
                        <div className="text-2xl font-bold ltr:mr-3 rtl:ml-3">
                            P:{' '}
                            {user?.balanceP
                                ? Math.ceil(user?.balanceP * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                      //   style: 'currency',
                                      //   currency: 'VND',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                  })
                                : 0}{' '}
                        </div>
                        <div className="text-xs mt-1 font-bold ltr:mr-3 rtl:ml-3">
                            {t('total_payment')}: {user?.totalDeposit.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 })} -{' '}
                            {parseFloat(systemConfig.usd_vnd) > 0 && user?.totalDeposit
                                ? (user?.totalDeposit / parseFloat(systemConfig.usd_vnd)).toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                  })
                                : 0}
                        </div>
                    </div>
                    <div className="flex items-center font-semibold mt-5"></div>
                </div>

                {/*  Time On-Site */}
                <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{t('money_charged')}</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center mt-5">
                        <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3"> {dataOrder?.data?.total} </div>
                        <div className="mx-auto flex flex-col ">
                            <div className="badge bg-white/30  flex items-center font-semibold ">
                                {' '}
                                {t('this_month')} {dataOrder?.data?.month}
                            </div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">
                                {' '}
                                {t('this_week')} {dataOrder?.data?.week}
                            </div>
                            <div className="badge bg-white/30  flex items-center font-semibold ">
                                {' '}
                                {t('today')} {dataOrder?.data?.day}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bounce Rate */}
                <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
                    <div className="flex justify-between">
                        <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">{t('package_p')}</div>
                        <div className="dropdown">
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 items-center mt-5">
                        {user?.packageOrder ? (
                            <>
                                <div className="text-4xl font-bold ltr:mr-3 rtl:ml-3">
                                    <span className="text-xs">{t('remain')}</span> {user?.packageOrder?.dailyLeft}{' '}
                                    <span className="text-xs">
                                        {t('times')} / {t('day')}
                                    </span>
                                </div>
                                <div className="mx-auto flex flex-col ">
                                    <div className="badge bg-white/30  flex items-center font-semibold ">
                                        {t('day_expire')} {formatDate(user?.packageOrder?.expireTime)}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-md">{t('user_package_not_found')}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Box;
