import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { PackageType } from '../../types/stock';
import themeConfig from '../../theme.config';
import { PackagePricingG, PackagePricingP } from '../../types/package';
import { ItemPackage } from '../ItemPackage';
import { useTranslation } from 'react-i18next';

type Props = {
    type: PackageType;
    dataG?: PackagePricingG[];
    dataP?: PackagePricingP[];
};

export const PackageSwipe = ({ type, dataG, dataP }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="swiper" id="slider5">
            <div className="">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                        nextEl: `.swiper-button-next-${type}`,
                        prevEl: `.swiper-button-prev-${type}`,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 40,
                        },
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                    }}
                    dir={themeConfig.rtlClass}
                    key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
                >
                    {type === PackageType.G && dataG
                        ? dataG?.map((packageItem: PackagePricingG) => (
                              <SwiperSlide key={packageItem.id}>
                                  <ItemPackage packageG={packageItem} />
                              </SwiperSlide>
                          ))
                        : ''}

                    {type === PackageType.P && dataP
                        ? dataP?.map((packageItem: PackagePricingP) => (
                              <SwiperSlide key={packageItem.id}>
                                  <ItemPackage packageP={packageItem} />
                              </SwiperSlide>
                          ))
                        : ''}
                </Swiper>
            </div>
            <button
                className={`swiper-button-prev-${type} grid place-content-center ltr:left-2 rtl:right-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rtl:rotate-180">
                    <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <button
                className={`swiper-button-next-${type} grid place-content-center ltr:right-2 rtl:left-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180">
                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};

export default PackageSwipe;
