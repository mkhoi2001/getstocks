import React from 'react';
import { PayPalScriptProvider, usePayPalScriptReducer, PayPalButtons, PayPalButtonsComponentProps } from '@paypal/react-paypal-js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { createOrderByPaypal } from '../../services/paymentService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../router/routes';

type Props = {
    className?: string;
    cost: string;
    handleOrderPaypal: (data: any) => void;
};

export const PayPalButton = ({ handleOrderPaypal, cost, className }: Props) => {
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);
    const navigate = useNavigate();

    const { t } = useTranslation();
    return (
        <div className={className}>
            <p className={'mb-3 font-bold text-lg'}>
                {t('cost_payment')}: ${cost}
            </p>
            {/*<PayPalScriptProvider options={{ clientId: systemConfig.client_id_paypal || 'test' }}>
                <PayPalButtons
                    style={{
                        layout: 'vertical', // Choose from: "vertical", "horizontal"
                        color: 'gold', // Choose from: "gold", "blue", "silver", "black"
                        shape: 'rect', // Choose from: "pill", "rect"
                        height: 40,
                    }}
                    createOrder={(data, actions) => {
                        return actions.order
                            .create({
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: 'USD',
                                            value: `${cost}`,
                                        },
                                    },
                                ],
                            })
                            .then((orderId) => {
                                // Your code here after create the order
                                // console.log('orderId ', orderId);
                                return orderId;
                            });
                    }}
                    onApprove={(data: OnApproveData, actions: OnApproveActions) => {
                        console.log('data ', data);
                        return actions.order!.capture().then((details) => {
                            console.log('detail ', details);
                            handleOrderPaypal(details);
                        });
                    }}
                ></PayPalButtons>
            </PayPalScriptProvider>*/}
        </div>
    );
};

export default PayPalButton;
