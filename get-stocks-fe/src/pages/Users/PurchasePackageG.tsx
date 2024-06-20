import { useQuery } from '@tanstack/react-query';
import { getAllPackageG } from '../../services/packageService';
import { PackagePricingG, PackagePricingP } from '../../types/package';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ItemPackage, PackageSwipe, Spinner } from '../../components';
import { PackageType } from '../../types/stock';
import { useTranslation } from 'react-i18next';
import { IRootState } from '../../store';
import { useSelector } from 'react-redux';

type Props = {};

const PurchasePackage = (props: Props) => {
    const { t } = useTranslation();

    const { data: packageGData, isLoading } = useQuery({
        queryKey: ['packageG'],
        queryFn: getAllPackageG,
    });

    return (
        <div>
            <div className="panel drop-shadow-lg lg:col-span-2 mb-3">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg text-center mx-auto font-semibold text-lg dark:text-white-light">{t('package_g')}</h3>
                </div>
                <div className="max-w-[320px] md:max-w-[990px] mx-auto">
                    {isLoading ? (
                        <Spinner className="w-full mx-auto flex " />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 gap-y-8">
                            {/* <PackageSwipe type={PackageType.G} dataG={packageGData?.data?.content} /> */}
                            {packageGData?.data?.content && packageGData?.data?.content.map((item: PackagePricingG) => <ItemPackage key={item.id} packageG={item} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchasePackage;
