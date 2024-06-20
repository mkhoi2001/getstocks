import React from 'react';
import { PackagePForm } from './Components';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRoutes } from '../../../router/routes';
import { getPacakgePById, updatePackageP } from '../../../services/packageService';
import toast from 'react-hot-toast';

type Props = {};

const PackagePDetail = (props: Props) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();
    if (!id) {
        navigate(AdminRoutes.PACKAGE_G);
    }

    const { data: packageP } = useQuery({
        queryKey: ['packagePId', id],
        queryFn: () => getPacakgePById(id),
        enabled: !!id,
        onError: (error) => {
            toast.error('Không tìm thấy người dùng với id: ' + id);
            navigate(AdminRoutes.PACKAGE_P);
        },
    });

    const {
        mutate: updatePackagePMutation,
        isLoading: isLoadingUpdate,
        isSuccess: isSuccessUpdate,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: updatePackageP,
        onSuccess: (data: any) => {
            queryClient.setQueriesData(['packagePId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
            // queryClient.invalidateQueries({ queryKey: ['userId', id] });
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to={AdminRoutes.PACKAGE_P} className="hover:cursor-pointer">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <div className="pt-5 p-2">
                <PackagePForm mutation={updatePackagePMutation} isSuccess={isSuccessUpdate} isLoading={isLoadingUpdate} packageP={packageP?.data} isNew={false} />
            </div>
        </div>
    );
};

export default PackagePDetail;
