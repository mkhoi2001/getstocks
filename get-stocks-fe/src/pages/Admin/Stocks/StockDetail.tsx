import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRoutes } from '../../../router/routes';
import { getStockById, updateStock } from '../../../services/stockService';
import { StockForm } from './Components';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Props = {};

export const StockDetail = (props: Props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    if (!id) {
        navigate(AdminRoutes.STOCK);
    }
    const queryClient = useQueryClient();

    const { data: stockInfo, isSuccess: isSuccessStock } = useQuery({
        queryKey: ['stockId', id],
        queryFn: () => getStockById(id),
        enabled: !!id,
        onError: (error) => {
            toast.error(t('stock_not_found'));
            navigate(AdminRoutes.STOCK);
        },
    });

    const {
        mutate: updateStockMutation,
        isLoading: isLoadingUpdate,
        isSuccess: isSuccessUpdate,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: updateStock,
        onSuccess: (data: any) => {
            queryClient.setQueryData(['stockId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success(t('update_success'));
            // queryClient.invalidateQueries({ queryKey: ['userId', id] });
        },
        onError: (error: any) => {
            toast.error(error?.message || t('has_error'));
        },
    });

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to={AdminRoutes.STOCK} className="hover:cursor-pointer">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <div className="pt-5 p-2">
                <StockForm mutation={updateStockMutation} stock={stockInfo?.data} isSuccess={isSuccessStock} />
            </div>
        </div>
    );
};

export default StockDetail;
