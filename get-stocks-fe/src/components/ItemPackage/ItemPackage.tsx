import { PackagePricingG, PackagePricingP } from '../../types/package';
import { AppRoutes } from '../../router/routes';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import parse from 'html-react-parser';
import i18next from 'i18next';

type Props = {
    packageG?: PackagePricingG;
    packageP?: PackagePricingP;
};

export const ItemPackage = ({ packageG, packageP }: Props) => {
    const { t } = useTranslation();
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);

    const navigate = useNavigate();
    return (
        <div>
            {packageG ? (
                <div className="min-h-[430px] p-3 grid grid-col-1 lg:p-5 panel border-primary border-2 text-center rounded group hover:border-primary">
                    <h3 className="text-xl lg:text-2xl text-red-500">{packageG?.name}</h3>
                    <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                    <p className="text-[15px]">
                        {t('g_plus_package')}:{' '}
                        {packageG?.balanceG
                            ? Math.ceil(packageG?.balanceG * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                  //   style: 'currency',
                                  //   currency: 'VND',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                              })
                            : 0}
                    </p>
                    <p className="text-[15px]">
                        {t('p_plus_package')}:{' '}
                        {packageG?.balanceP
                            ? Math.ceil(packageG?.balanceP * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                  //   style: 'currency',
                                  //   currency: 'VND',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                              })
                            : 0}
                    </p>
                    <div className="my-5 p-2.5 text-center text-lg group-hover:text-primary">
                        <strong className="text-violet-600  text-2xl lg:text-2xl font-bold group-hover:text-primary">
                            <span className="text-base">{t('cost_package')}:</span>{' '}
                            {i18next.language == 'vn'
                                ? packageG?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 })
                                : parseFloat(systemConfig.usd_vnd) > 0
                                ? (packageG?.price / parseFloat(systemConfig.usd_vnd)).toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })
                                : ''}
                        </strong>
                    </div>
                    <div className="mb-5 overflow-auto">
                        {i18next.language === 'vn' && packageG?.guideVn ? parse(packageG?.guideVn) : ''}
                        {i18next.language === 'en' && packageG?.guideEn ? parse(packageG?.guideEn) : ''}
                        {!packageG?.guideVn && !packageG?.guideEn ? (
                            <ul className="space-y-2.5 font-semibold group-hover:text-primary">
                                <li className="flex justify-center items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('no_expire')}
                                </li>
                                <li className="flex justify-center items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('download_package')}
                                </li>
                                <li className="flex justify-center items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('explore_new_features_in_future')}
                                </li>
                            </ul>
                        ) : (
                            ''
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(`${AppRoutes.PAYMENT}?id=${packageG?.id}&type=G`)}
                        className="btn btn-primary border-none hover:from-fuchsia-400 hover:to-fuchsia-300  w-full bg-gradient-to-r from-fuchsia-500 "

                        // className="btn text-black shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                    >
                        {t('register')}
                    </button>
                </div>
            ) : (
                ''
            )}
            {packageP ? (
                <div className=" min-h-[430px] p-3 lg:p-5 border-2 border-info  text-center rounded group hover:border-primary">
                    <h3 className="text-xl lg:text-2xl text-red-500">{packageP?.name}</h3>
                    <div className="border-t border-black dark:border-white-dark w-1/5 mx-auto my-6 group-hover:border-primary"></div>
                    <p className="text-[15px]">
                        {t('days_using')}: {packageP?.dayExpires} {t('day')}
                    </p>
                    <p className="text-[15px]">
                        {t('daily_download')}: {packageP?.downPerDay} {t('times')}
                    </p>
                    <div className="my-5 p-2.5 text-center text-lg group-hover:text-primary">
                        <strong className="text-violet-600 dark:text-white-dark text-2xl lg:text-2xl group-hover:text-primary">
                            <span className="text-base">{t('cost_package')}:</span>{' '}
                            {i18next.language == 'vn'
                                ? packageP?.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 })
                                : parseFloat(systemConfig.usd_vnd) > 0
                                ? (packageP?.price / parseFloat(systemConfig.usd_vnd)).toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })
                                : ''}
                        </strong>
                    </div>
                    <div className="mb-5 overflow-auto">
                        {i18next.language === 'vn' && packageP?.guideVn ? parse(packageP?.guideVn) : ''}
                        {i18next.language === 'en' && packageP?.guideEn ? parse(packageP?.guideEn) : ''}
                        {!packageP?.guideVn && !packageP?.guideEn ? (
                            <ul className="space-y-2.5 font-semibold group-hover:text-primary">
                                <li className="flex justify-center items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('daily_download_reset')}
                                </li>
                                <li className="flex justify-center items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('download_package')}
                                </li>
                                <li className="flex justify-center items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ltr:mr-1 rtl:ml-1 rtl:rotate-180">
                                        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('explore_new_features_in_future')}
                                </li>
                            </ul>
                        ) : (
                            ''
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            {
                                packageG ? navigate(`${AppRoutes.PAYMENT}?id=${packageP?.id}&type=P`) : navigate(`${AppRoutes.PAYMENT}?id=${packageP?.id}&type=P`);
                            }
                        }}
                        className="btn btn-primary border-none hover:from-pink-400 hover:to-pink-300 w-full bg-gradient-to-r from-pink-500"
                        // className="btn text-black  shadow-none group-hover:text-primary group-hover:border-primary group-hover:bg-primary/10 dark:text-white-dark dark:border-white-dark/50 w-full"
                    >
                        {t('register')}
                    </button>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default ItemPackage;
