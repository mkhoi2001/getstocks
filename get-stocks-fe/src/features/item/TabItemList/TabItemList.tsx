import { Tab } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemList } from '../ItemList';
import { useQuery } from '@tanstack/react-query';
import { getAllActiveStockTypeG, getAllActiveStockTypeP } from '../../../services/stockService';
import { PackageType } from '../../../types/stock';

type Props = {};

export const TabItemList = (props: Props) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { t } = useTranslation();

    const { data: stockGData, isLoading: isLoadingG } = useQuery({
        queryKey: ['stocks-g'],
        queryFn: getAllActiveStockTypeG,
        onSuccess: (data) => {},
    });

    const { data: stockPData, isLoading: isLoadingP } = useQuery({
        queryKey: ['stocks-p'],
        queryFn: getAllActiveStockTypeP,
        onSuccess: (data) => {},
    });

    return (
        <div>
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''}
                                                    dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                            >
                                {t('package_g')}
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''}
                                                    dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                            >
                                {t('package_p')}
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <ItemList isLoading={isLoadingG} tabType={PackageType.G} items={stockGData?.data?.content} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <ItemList isLoading={isLoadingP} tabType={PackageType.P} items={stockPData?.data?.content} />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default TabItemList;
