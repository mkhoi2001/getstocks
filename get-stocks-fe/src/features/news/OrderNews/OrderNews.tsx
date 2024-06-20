import { useQuery } from '@tanstack/react-query';
import { getNewsOrderHistory, getNewsOrderHistoryOwn } from '../../../services/dashboardService';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { formatDateTime } from '../../../utils/formatDate';
import { useTranslation } from 'react-i18next';

type Props = {};

export const OrderNews = (props: Props) => {
    const { t } = useTranslation();
    const { data } = useQuery({
        queryKey: ['newsOrder'],
        queryFn: getNewsOrderHistoryOwn,
    });

    return (
        <div>
            <div className=" h-full">
                <div className="h-full max-w-[900px] mx-auto">
                    <h3 className="font-bold text-[18px]">{t('recently_orders')}</h3>
                    <PerfectScrollbar className="max-h-[300px] h-full p-2 pt-0">
                        {data?.data?.content?.length
                            ? data?.data?.content?.map((item: any) => (
                                  <div className="flex" key={item.id}>
                                      <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-success before:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[25px] after:-bottom-[15px] after:w-0 after:h-auto after:border-l-2 after:border-success after:rounded-full"></div>
                                      {/* <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-secondary before:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[25px] after:-bottom-[15px] after:w-0 after:h-auto after:border-l-2 after:border-secondary after:rounded-full"></div> */}
                                      <div className="p-2.5 self-center ltr:ml-2.5 rtl:ltr:mr-2.5 rtl:ml-2.5">
                                          <p className="text-[#3b3f5c] dark:text-white-light w-fit px-1 max-w-[150px] bg-[#EEF0F8] dark:bg-dark italic text-[13px] font-semibold ">
                                              {formatDateTime(item?.updatedAt)}
                                          </p>
                                          <p className="text-[#3b3f5c] dark:text-white-light font-semibold text-md">
                                              {item?.user?.username} {t('message_news_order')} {item?.packagePricingP?.name || item?.packagePricingG?.name}
                                          </p>
                                          {/* <p className="text-white-dark text-xs font-bold self-center min-w-[100px] max-w-[100px]">25 mins ago</p> */}
                                      </div>
                                  </div>
                              ))
                            : ''}
                    </PerfectScrollbar>

                    {/* <div className="flex">
                        <p className="text-[#3b3f5c] dark:text-white-light min-w-[58px] max-w-[100px] text-base font-semibold py-2.5">12:45</p>
                        <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-secondary before:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[25px] after:-bottom-[15px] after:w-0 after:h-auto after:border-l-2 after:border-secondary after:rounded-full"></div>
                        <div className="p-2.5 self-center ltr:ml-2.5 rtl:ltr:mr-2.5 rtl:ml-2.5">
                            <p className="text-[#3b3f5c] dark:text-white-light font-semibold text-[13px]">Backup Files EOD</p>
                        </div>
                    </div>
                    <div className="flex">
                        <p className="text-[#3b3f5c] dark:text-white-light min-w-[58px] max-w-[100px] text-base font-semibold py-2.5">14:00</p>
                        <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-success before:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[25px] after:-bottom-[15px] after:w-0 after:h-auto after:border-l-2 after:border-success after:rounded-full"></div>
                        <div className="p-2.5 self-center ltr:ml-2.5 rtl:ltr:mr-2.5 rtl:ml-2.5">
                            <p className="text-[#3b3f5c] dark:text-white-light font-semibold text-[13px]">Send Mail to HR and Admin</p>
                        </div>
                    </div>
                    <div className="flex">
                        <p className="text-[#3b3f5c] dark:text-white-light min-w-[58px] max-w-[100px] text-base font-semibold py-2.5">16:00</p>
                        <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-danger before:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[25px] after:-bottom-[15px] after:w-0 after:h-auto after:border-l-2 after:border-danger after:rounded-full"></div>
                        <div className="p-2.5 self-center ltr:ml-2.5 rtl:ltr:mr-2.5 rtl:ml-2.5">
                            <p className="text-[#3b3f5c] dark:text-white-light font-semibold text-[13px]">Conference call with Marketing Manager.</p>
                        </div>
                    </div>
                    <div className="flex">
                        <p className="text-[#3b3f5c] dark:text-white-light min-w-[58px] max-w-[100px] text-base font-semibold py-2.5">17:00</p>
                        <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-warning before:rounded-full after:absolute after:left-1/2 after:-translate-x-1/2 after:top-[25px] after:-bottom-[15px] after:w-0 after:h-auto after:border-l-2 after:border-warning after:rounded-full"></div>
                        <div className="p-2.5 self-center ltr:ml-2.5 rtl:ltr:mr-2.5 rtl:ml-2.5">
                            <p className="text-[#3b3f5c] dark:text-white-light font-semibold text-[13px]">
                                Collected documents from <button type="button">Sara</button>
                            </p>
                        </div>
                    </div>
                    <div className="flex">
                        <p className="text-[#3b3f5c] dark:text-white-light min-w-[58px] max-w-[100px] text-base font-semibold py-2.5">16:00</p>
                        <div className="relative before:absolute before:left-1/2 before:-translate-x-1/2 before:top-[15px] before:w-2.5 before:h-2.5 before:border-2 before:border-info before:rounded-full"></div>
                        <div className="p-2.5 self-center ltr:ml-2.5 rtl:ltr:mr-2.5 rtl:ml-2.5">
                            <p className="text-[#3b3f5c] dark:text-white-light font-semibold text-[13px]">Server rebooted successfully</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default OrderNews;
