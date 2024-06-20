import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMomoById, updateMomo } from '../../../services/momoService';
import toast from 'react-hot-toast';
import { WalletForm } from '../WalletForm';
import { getDefaultDataByType } from '../../../services/defaultService';

type Props = {};

export const WalletPage = (props: Props) => {
    const queryClient = useQueryClient();
    const [id, setId] = useState<string>('');

    useQuery({
        queryKey: ['momoDefault'],
        queryFn: () => getDefaultDataByType('momo'),
        onSuccess: (data) => {
            if (data?.data?.dataId) {
                setId(data?.data?.dataId);
            }
        },
        onError: (error) => {
            toast.error('Không tìm thấy momo');
        },
    });

    const { data: momoInfo, isSuccess: isSuccessMomo } = useQuery({
        queryKey: ['momoId', id],
        queryFn: () => getMomoById(id),
        enabled: !!id,
        onError: (error) => {
            toast.error('Không tìm thấy momo');
        },
    });

    const {
        mutate: updateMomoMutation,
        isSuccess: isSuccessUpdate,
        isLoading: isLoadingUpdate,
    } = useMutation({
        mutationFn: updateMomo,
        onSuccess: (data: any) => {
            queryClient.setQueriesData(['momoId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    return (
        <div>
            {momoInfo?.data ? (
                <WalletForm momo={momoInfo?.data} mutation={updateMomoMutation} isSuccess={isSuccessUpdate} isLoading={isLoadingUpdate} />
            ) : (
                <p className="text-lg">
                    Không tìm thấy momo với id: <span className="font-bold">{id}</span>
                </p>
            )}
        </div>
    );
};

export default WalletPage;
