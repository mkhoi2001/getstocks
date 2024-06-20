import { PackageGForm } from './Components';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRoutes } from '../../../router/routes';
import { getPacakgeGById, updatePackageG } from '../../../services/packageService';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Props = {};

const PackageGDetail = (props: Props) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();
    if (!id) {
        navigate(AdminRoutes.PACKAGE_G);
    }
    const { t } = useTranslation();

    const { data: packageG } = useQuery({
        queryKey: ['packageGId', id],
        queryFn: () => getPacakgeGById(id),
        enabled: !!id,
        onError: (error) => {
            toast.error(t('package_not_found'));
            navigate(AdminRoutes.PACKAGE_G);
        },
    });

    const {
        mutate: updatePackageGMutation,
        isLoading: isLoadingUpdate,
        isSuccess: isSuccessUpdate,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: updatePackageG,
        onSuccess: (data: any) => {
            queryClient.setQueriesData(['packageGId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
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
                <Link to={AdminRoutes.PACKAGE_G} className="hover:cursor-pointer">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <div className="pt-5 p-2">
                <PackageGForm mutation={updatePackageGMutation} isSuccess={isSuccessUpdate} isLoading={isLoadingUpdate} packageG={packageG?.data} isNew={false} />
            </div>
        </div>
    );
};

export default PackageGDetail;
