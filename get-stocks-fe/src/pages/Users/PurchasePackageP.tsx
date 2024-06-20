import { useQuery } from '@tanstack/react-query';
import { getAllPackageP } from '../../services/packageService';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ItemPackage, PackageSwipe, Spinner } from '../../components';
import { PackageType } from '../../types/stock';
import { useTranslation } from 'react-i18next';
import { PackagePricingP } from '../../types/package';

type Props = {};

const PurchasePackage = (props: Props) => {
    const { t } = useTranslation();

    const { data: packagePData, isLoading } = useQuery({
        queryKey: ['packageP'],
        queryFn: getAllPackageP,
    });

    return (
        <div>
            <div className="panel drop-shadow-lg lg:col-span-2 mb-3">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg text-center mx-auto font-semibold text-lg dark:text-white-light">{t('package_p')}</h3>
                </div>
                <div className="max-w-[320px] md:max-w-[990px] mx-auto">
                    {isLoading ? (
                        <Spinner className="w-full mx-auto flex " />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 gap-y-8">
                            {/* <PackageSwipe type={PackageType.G} dataG={packageGData?.data?.content} /> */}
                            {packagePData?.data?.content && packagePData?.data?.content.map((item: PackagePricingP) => <ItemPackage key={item.id} packageP={item} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchasePackage;
