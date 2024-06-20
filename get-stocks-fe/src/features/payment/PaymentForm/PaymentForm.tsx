import { useCallback, useRef, useState } from 'react';
import { Bank } from '../../../types/bank';
import { Momo } from '../../../types/momo';
import { PackagePricingG, PackagePricingP } from '../../../types/package';
import { PaymentAlert } from '../PaymentAlert';
import { useMutation } from '@tanstack/react-query';
import { createOrderHistory, createOrderByPaypal } from '../../../services/paymentService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../../router/routes';
import { Order } from '../../../types/order';
import { PackageType } from '../../../types/stock';
import { generateRandomString } from '../../../utils/randomCharacter';
import { IRootState } from '../../../store';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PaymentPending } from './PaymentPending';
import { PayPalButton } from '../../../components';
import i18next from 'i18next';
import { SHOW_PAYPAL } from '../../../utils/const';

type Props = {
    packagePricing: PackagePricingP & PackagePricingG;
    payment?: Bank & Momo;
    typePayment: string;
};

export const PaymentForm = ({ typePayment, packagePricing, payment }: Props) => {
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);
    const user = useSelector((state: IRootState) => state.user?.data?.info);
    const randomString = useRef(generateRandomString(6)).current;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const navigate = useNavigate();
    const { t } = useTranslation();

    const { mutate: orderByPaypalMutation } = useMutation({
        mutationFn: createOrderByPaypal,
        onSuccess: (data: any) => {
            navigate(AppRoutes.HISTORY_PAY);
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const handleOrderPaypal = async (paymentInfo: any) => {
        setMessage(t('order_handling'));

        const order: any = {
            content: '',
            cost: packagePricing.price,
            costPayment: parseFloat(paymentInfo?.purchase_units[0]?.amount?.value),
            currency: paymentInfo?.purchase_units[0]?.amount?.currency_code,
            packageType: packagePricing?.balanceG ? PackageType.G : PackageType.P,
        };
        if (packagePricing?.balanceG) {
            order.packagePricingGId = packagePricing.id;
        } else {
            order.packagePricingPId = packagePricing.id;
        }
        orderByPaypalMutation(order);
    };

    const handlePayment = () => {
        // setIsProcessing(true);
        setMessage(t('order_is_creating'));

        const order: any = {
            // content: 'viminhkhoi',
            content: user?.username + packagePricing.content,
            provider: payment?.bankName || 'Momo',
            phone: payment?.phone || null,
            cost: packagePricing.price,
            currency: 'vnd',
            packageType: packagePricing?.balanceG ? PackageType.G : PackageType.P,
        };
        if (packagePricing?.balanceG) {
            order.packagePricingGId = packagePricing.id;
        } else {
            order.packagePricingPId = packagePricing.id;
        }
        orderMutation(order);
    };

    const createOrder = () => {
        // setIsProcessing(false);
    };

    const { mutate: orderMutation } = useMutation({
        mutationFn: createOrderHistory,
        onSuccess: (data) => {
            setIsOpen(true);
        },
        onError: (error: any) => {
            toast.error(error?.message || 'System is busy now !!!');
        },
    });

    return (
        <div className="h-full">
            {isOpen ? (
                <PaymentAlert
                    setMessage={setMessage}
                    handleSubmit={() => {
                        navigate(AppRoutes.HISTORY_PAY);
                    }}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    title={t('create_order_success')}
                />
            ) : (
                ''
            )}

            {message ? (
                <div className="flex items-center   h-full">
                    <p className="text-2xl font-bold text-center">{message}...</p>
                </div>
            ) : (
                ''
            )}
            {/* {isProcessing ? <PaymentPending createOrder={createOrder} /> : ''} */}

            {!message ? (
                <>
                    <div>
                        {i18next.language == 'vn' ? (
                            <>
                                <h2 className="font-bold text-2xl text-center">{t('payment_instruction')}</h2>
                                <p className="my-4 text-lg text-center">
                                    <span className="text-info">{t('note')}</span>: {t('content_right_payment')} "
                                    <span className="text-danger font-bold text-xl">
                                        {/* {systemConfig.botsms_content || 'getfile'}&nbsp; */}
                                        {user?.username}
                                        {packagePricing?.content}
                                    </span>
                                    " {t('payment_instruction_2')} "<span className="text-danger font-bold text-xl">{t('have_paid')}</span>" {t('payment_instruction_3')}{' '}
                                </p>
                                {payment && typePayment != 'paypal' ? (
                                    <div>
                                        <div className="mt-8">
                                            <div className="table-responsive mb-5">
                                                <table className="table-hover table-striped border-collapse border border-slate-400">
                                                    {/* <thead>
                            <tr className="!bg-transparent dark:!bg-transparent">
                                <th className="border border-slate-300 ">#</th>
                                <th className="border border-slate-300 ">Name</th>
                            </tr>
                        </thead> */}
                                                    <tbody>
                                                        <tr key={payment?.id}>
                                                            <td className="border border-slate-300 font-bold text-right">{t('bank_username')}</td>
                                                            <td className="border border-slate-300 ">
                                                                <div className="whitespace-nowrap">{payment?.username}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-slate-300 text-right">
                                                                <span className="text-right font-bold">{t('bank_number')}</span>
                                                            </td>
                                                            <td className="border border-slate-300 ">
                                                                <div className="whitespace-nowrap">{payment?.cardNumber || payment?.phone}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-slate-300 font-bold">{t('bank_name')}</td>
                                                            <td className="border border-slate-300 ">
                                                                <div className="whitespace-nowrap">{payment?.bankName ? payment?.bankName : 'Momo'}</div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-slate-300 font-bold">{t('cost_payment')}</td>
                                                            <td className="border border-slate-300 ">
                                                                <div className="whitespace-nowrap">
                                                                    {`${packagePricing?.price?.toLocaleString('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND',
                                                                        minimumFractionDigits: 0,
                                                                        maximumFractionDigits: 2,
                                                                    })} - ${
                                                                        parseFloat(systemConfig.usd_vnd) > 0
                                                                            ? (packagePricing?.price / parseFloat(systemConfig.usd_vnd)).toLocaleString('en-US', {
                                                                                  style: 'currency',
                                                                                  currency: 'USD',
                                                                                  minimumFractionDigits: 0,
                                                                                  maximumFractionDigits: 2,
                                                                              })
                                                                            : ''
                                                                    }`}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-slate-300 font-bold">{t('content_order')}*</td>
                                                            <td className="border border-slate-300 ">
                                                                <div className="whitespace-nowrap">{`${user?.username}${packagePricing?.content}`}</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button onClick={handlePayment} type="button" className="h-[50px] w-fit btn btn-info mt-5">
                                                <span className="text-lg"> {t('have_paid')}</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>{typePayment != 'paypal' ? <h2 className="font-bold text-2xl text-center">{t('please_choose_type_payment')}</h2> : ''}</>
                                )}
                            </>
                        ) : (
                            ''
                        )}

                        {typePayment === 'paypal' && systemConfig.show_paypal == SHOW_PAYPAL.OPEN ? (
                            <PayPalButton
                                handleOrderPaypal={handleOrderPaypal}
                                cost={packagePricing?.price > 0 ? `${Math.round((packagePricing?.price / parseFloat(systemConfig.usd_vnd)) * 100) / 100}` : `0`}
                                className="px-10 max-w-[100%] xl:max-w-[50%] mx-auto mt-3 overflow-auto"
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
};

export default PaymentForm;
