import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const PaymentPending = ({ createOrder }: { createOrder: () => void }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (createOrder) {
            createOrder();
        }
    }, [createOrder]);

    return (
        <div className="flex items-center   h-full">
            <p className="text-2xl font-bold text-center">{t('order_is_creating')}...</p>
        </div>
    );
};
