import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRoutes } from '../../../router/routes';
import { getBankById, updateBank } from '../../../services/bankService';
import toast from 'react-hot-toast';
import { BankForm } from '../../../features/bank';

type Props = {};

export const BankDetail = (props: Props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    if (!id) {
        navigate(AdminRoutes.BANK);
    }

    const queryClient = useQueryClient();

    const {
        data: bankInfo,
        isSuccess: isSuccessBank,
        refetch,
    } = useQuery({
        queryKey: ['bankId', id],
        queryFn: () => getBankById(id),
        enabled: !!id,
        onError: (error) => {
            toast.error('Không tìm thấy bank với id: ' + id);
            navigate(AdminRoutes.BANK);
        },
    });

    const {
        mutate: updateBankMutation,
        isSuccess: isSuccessUpdate,
        isLoading: isLoadingUpdate,
    } = useMutation({
        mutationFn: updateBank,
        onSuccess: (data: any) => {
            refetch();
            // queryClient.setQueriesData(['bankId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to={AdminRoutes.BANK} className="hover:cursor-pointer">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <div className="pt-5 p-2">
                <BankForm bank={bankInfo?.data} mutation={updateBankMutation} isSuccess={isSuccessUpdate} isLoading={isLoadingUpdate} />
            </div>
        </div>
    );
};

export default BankDetail;
