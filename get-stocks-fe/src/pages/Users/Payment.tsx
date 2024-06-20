import { useQuery } from '@tanstack/react-query';
import { getAllActiveBanks } from '../../services/bankService';
import { PaymentForm } from '../../features/payment';
import { Bank } from '../../types/bank';
import { useState, useEffect } from 'react';
import { getMomoById, getAllMomoActive } from '../../services/momoService';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PackageType } from '../../types/stock';
import { getPacakgeGById, getPacakgePById } from '../../services/packageService';
import { AppRoutes } from '../../router/routes';
import { Momo } from '../../types/momo';
import { PackagePricingG, PackagePricingP } from '../../types/package';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { generateMomoQR, generateUrlQr } from '../../utils/generateQR';
import i18next from 'i18next';
import { SHOW_PAYPAL } from '../../utils/const';

type Props = {};

const Payment = (props: Props) => {
    // const [momoId, setMomoId] = useState<string>('ebec3db6-5c6f-493e-97cb-5bb68294cd3d');
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);
    const user = useSelector((state: IRootState) => state.user?.data?.info);

    const navigate = useNavigate();
    const [payment, setPayment] = useState<(Bank & Momo) | null>();
    const [searchParams, setSearchParams] = useSearchParams();
    const packageId = searchParams.get('id') || '';
    const [typePayment, setTypePayment] = useState('');
    const [dataQR, setDataQR] = useState<any>({});
    const type = searchParams.get('type') || '';
    const { t } = useTranslation();
    useEffect(() => {
        if (searchParams) {
            if (!packageId || !type) {
                navigate(AppRoutes.DASHBOARD_USER);
            }
            if (!Object.keys(PackageType).includes(type)) {
                navigate(AppRoutes.DASHBOARD_USER);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (i18next.language == 'vn') {
            setTypePayment('');
        }
    }, [i18next]);

    useEffect(() => {
        const getQr = async () => {
            const data = await generateUrlQr({
                bank_id: payment?.bankcode || '970436',
                account_no: payment?.cardNumber || '',
                template: 'compact2',
                amount: `${packageG?.data?.price}` || `${packageP?.data.price}`,
                description: `${user?.username}${packageG?.data?.content || packageP?.data?.content}`,
                account_name: `${payment?.username}`,
            });
            setDataQR((prev: any) => {
                return {
                    ...prev,
                    bank: data,
                };
            });
        };

        const getMomoQr = async () => {
            const data = await generateMomoQR({
                content: `${user?.username}${packageG?.data?.content || packageP?.data?.content}`,
                phone: momo && momo?.data.content?.length ? momo?.data?.content[0]?.phone : '0359181712',
                amount: `${packageG?.data?.price}` || `${packageP?.data.price}`,
            });
            // console.log('first ', momo?.data?.content[0]?.phone, data);
            setDataQR((prev: any) => {
                return {
                    ...prev,
                    momo: data,
                };
            });
        };

        if (typePayment == 'bank' && user) {
            getQr();
        } else if (typePayment == 'momo' && user) {
            getMomoQr();
        }
    }, [typePayment]);

    const { data: momo } = useQuery({
        queryKey: ['momo'],
        queryFn: getAllMomoActive,
    });

    // const { data: momoInfo } = useQuery({
    //     queryKey: ['momoId', momoId],
    //     queryFn: () => getMomoById(momoId),
    //     enabled: !!momoId,
    //     onError: (error) => {
    //         // toast.error('Không tìm thấy momo với id: ' + momoId);
    //     },
    // });

    const { data: packageG } = useQuery({
        queryKey: ['packageGId', packageId],
        queryFn: () => getPacakgeGById(packageId),
        enabled: type === PackageType.G,
        onError: (error) => {
            toast.error(t('package_not_found'));
        },
    });

    const { data: packageP } = useQuery({
        queryKey: ['packagePId', packageId],
        queryFn: () => getPacakgePById(packageId),
        enabled: type === PackageType.P,
        onError: (error) => {
            toast.error(t('package_not_found'));
        },
    });

    const { data: bankData } = useQuery({
        queryKey: ['banks'],
        queryFn: getAllActiveBanks,
        onSuccess: (data: any) => {
            if (data?.data?.content?.length) {
                const bank = data?.data?.content[0];
                setPayment(bank);
                setTypePayment('bank');
            }
        },
    });

    return (
        <div className="h-full">
            <div className="grid grid-cols-5 gap-3 ">
                <div className="panel md:col-span-2  col-span-5">
                    <div className="flex items-center gap-3 mb-3">
                        <Link to={packageG ? AppRoutes.PURCHASE_PACKAGE_G : packageP ? AppRoutes.PURCHASE_PACKAGE_P : AppRoutes.DASHBOARD_USER} className="hover:cursor-pointer">
                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <h4 className="text-xl font-bold ">{t('choose_type_payment')}</h4>
                    </div>
                    {i18next.language == 'vn' ? (
                        <div className=" flex flex-wrap">
                            {bankData?.data?.content
                                ? bankData?.data?.content?.map((bank: Bank) => (
                                      <div
                                          onClick={() => {
                                              setTypePayment('bank');
                                              setPayment(bank as Bank & Momo);
                                          }}
                                          key={bank.id}
                                          className={`${
                                              payment?.id === bank.id ? 'border-cyan-500' : ''
                                          } max-w-[33%] text-center relative rounded-md p-[20px]  border-2 h-[70px] flex-1 hover:cursor-pointer`}
                                      >
                                          <span className={`${payment?.id === bank.id ? 'text-cyan-800' : ''}  `}> {bank?.bankName} </span>
                                          {payment?.id === bank?.id ? (
                                              <div className="absolute top-1 right-1">
                                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                      <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                              </div>
                                          ) : (
                                              ''
                                          )}
                                      </div>
                                  ))
                                : ''}
                            {momo?.data?.content
                                ? momo?.data?.content?.map((item: Momo) => (
                                      <div
                                          onClick={() => {
                                              setTypePayment('momo');
                                              setPayment(item as Bank & Momo);
                                          }}
                                          className={`${payment?.id === item.id ? 'border-cyan-500' : ''} max-w-[33%] text-center  relative rounded-md p-[20px]  border-2 flex-1 hover:cursor-pointer`}
                                          key={item?.id}
                                      >
                                          <span className={`${payment?.id === item.id ? 'text-cyan-800' : ''}  `}>Momo</span>
                                          {payment?.id === item?.id ? (
                                              <div className="absolute top-1 right-1">
                                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                      <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                  </svg>
                                              </div>
                                          ) : (
                                              ''
                                          )}
                                      </div>
                                  ))
                                : ''}

                            {systemConfig.show_paypal == SHOW_PAYPAL.OPEN && (
                                <div
                                    onClick={() => {
                                        setTypePayment('paypal');
                                        setPayment(null);
                                    }}
                                    className={`${
                                        typePayment === 'paypal' ? 'border-cyan-500' : ''
                                    } max-w-[33%] text-center relative rounded-md p-[20px]  border-2 h-[70px] flex-1 hover:cursor-pointer`}
                                >
                                    <span className={`${typePayment === 'paypal' ? 'text-cyan-800' : ''}  `}> Paypal </span>
                                    {typePayment === 'paypal' ? (
                                        <div className="absolute top-1 right-1">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className=" flex flex-wrap">
                            <div
                                onClick={() => {
                                    setTypePayment('paypal');
                                    setPayment(null);
                                }}
                                className={`${typePayment === 'paypal' ? 'border-cyan-500' : ''} max-w-[33%] text-center relative rounded-md p-[20px]  border-2 h-[70px] flex-1 hover:cursor-pointer`}
                            >
                                <span className={`${typePayment === 'paypal' ? 'text-cyan-800' : ''}  `}> Paypal </span>
                                {typePayment === 'paypal' ? (
                                    <div className="absolute top-1 right-1">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    )}

                    <div className="my-3">
                        {type === PackageType.G ? (
                            <div className="text-base">
                                <p>
                                    <span className="font-bold">{t('package_name')}:</span> {packageG?.data?.name}
                                </p>
                                <p>
                                    <span className="font-bold">{t('g_plus_package')}:</span>{' '}
                                    {packageG?.data.balanceG
                                        ? Math.ceil(packageG?.data.balanceG * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                              //   style: 'currency',
                                              //   currency: 'VND',
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                          })
                                        : 0}
                                </p>
                                <p>
                                    <span className="font-bold">{t('p_plus_package')}:</span>{' '}
                                    {packageG?.data.balanceP
                                        ? Math.ceil(packageG?.data.balanceP * parseFloat(systemConfig.usd_vnd)).toLocaleString('vi-VN', {
                                              //   style: 'currency',
                                              //   currency: 'VND',
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                          })
                                        : 0}
                                </p>
                                <p className="text-red-600">
                                    <span className="font-bold">{t('cost_payment')}:</span>{' '}
                                    {i18next.language == 'vn'
                                        ? packageG?.data?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 })
                                        : parseFloat(systemConfig.usd_vnd) > 0
                                        ? (packageG?.data?.price / parseFloat(systemConfig.usd_vnd)).toLocaleString('en-US', {
                                              style: 'currency',
                                              currency: 'USD',
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                          })
                                        : ''}
                                </p>
                            </div>
                        ) : (
                            ''
                        )}
                        {type === PackageType.P ? (
                            <div className="text-base">
                                <p>
                                    <span className="font-bold">{t('package_name')}:</span> {packageP?.data?.name}
                                </p>
                                <p>
                                    <span className="font-bold"> {t('day_using')}:</span> {packageP?.data?.dayExpires}
                                </p>
                                <p>
                                    <span className="font-bold"> {t('down_per_day')}:</span> {packageP?.data?.downPerDay}
                                </p>
                                <p className="text-red-600">
                                    <span className="font-bold"> {t('cost_payment')}:</span>{' '}
                                    {packageP?.data?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 2, maximumFractionDigits: 2 })} -{' '}
                                    {parseFloat(systemConfig.usd_vnd) > 0
                                        ? (packageP?.data?.price / parseFloat(systemConfig.usd_vnd)).toLocaleString('en-US', {
                                              style: 'currency',
                                              currency: 'USD',
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })
                                        : ''}
                                </p>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>

                    {i18next.language == 'vn' ? (
                        <div className=" w-full">
                            <img
                                className={`${typePayment == 'momo' ? '' : 'h-80'} mx-auto`}
                                src={
                                    typePayment == 'momo'
                                        ? dataQR?.momo ||
                                          `https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.15752-9/358090285_173387985727299_4702171304918711753_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=ae9488&_nc_ohc=WucJZQJblgoAX-zVFmS&_nc_ht=scontent.fsgn5-2.fna&oh=03_AdTe7GqoYNKxY3riz7-LgVRoUj_bPAfa3JpJSra1oFLuYg&oe=64CEE869`
                                        : typePayment == 'bank'
                                        ? dataQR?.bank ||
                                          `https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.15752-9/358490708_660207388943773_2964263512328359200_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=ae9488&_nc_ohc=to9YvDrWT8MAX8H9bcB&_nc_ht=scontent.fsgn5-9.fna&oh=03_AdSIeoOqzDWNcU5njAOSVFTVEvz0neNFZgdIxnji7y0hBg&oe=64CECACE`
                                        : ``
                                }
                            />
                        </div>
                    ) : (
                        <div className="h-80"></div>
                    )}
                </div>
                <div className="panel md:col-span-3 col-span-5">
                    <PaymentForm
                        typePayment={typePayment}
                        payment={payment as Bank & Momo}
                        packagePricing={(packageG?.data as PackagePricingG & PackagePricingP) || (packageP?.data as PackagePricingG & PackagePricingP)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Payment;
