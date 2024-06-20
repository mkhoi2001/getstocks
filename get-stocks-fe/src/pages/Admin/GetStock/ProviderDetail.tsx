import React from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { changeTypePackProvider, getStockProviderById } from '../../../services/stockService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProviderForm from './ProviderForm';

const ProviderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (!id) {
        navigate(AdminRoutes.GET_STOCK_PROV);
    }

    const { data: stock } = useQuery({
        queryKey: ['stockProviderNew', id],
        queryFn: () => getStockProviderById(id || ''),
        enabled: !!id,
        onError: (error) => {
            toast.error(t('stock_not_found'));
            navigate(AdminRoutes.GET_STOCK_PROV);
        },
    });

    const {
        mutate: changeTypePackProviderMutation,
        isLoading: isLoadingUpdate,
        isSuccess: isSuccessUpdate,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: changeTypePackProvider,
        onSuccess: () => {
            toast.success(t('update_success'));
            queryClient.invalidateQueries({ queryKey: ['stockProviderNew', id] });
        },
        onError: (error: any) => {
            toast.error(error?.message || t('has_error'));
        },
    });

    const { t } = useTranslation();

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to={AdminRoutes.GET_STOCK_PROV} className="hover:cursor-pointer">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <div className="pt-5 p-2">
                <ProviderForm mutation={changeTypePackProviderMutation} isSuccess={isSuccessUpdate} isLoading={isLoadingUpdate} stock={stock?.data} isNew={false} />
            </div>
        </div>
    );
};

export default ProviderDetail;
