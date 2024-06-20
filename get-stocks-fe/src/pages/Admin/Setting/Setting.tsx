import { Tab } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { AdminSetting, ClientSetting } from '../../../features/setting';
import { GuideBox } from '../../../components';

type Props = {};

export const Setting = (props: Props) => {
    const themeAdminConfig = useSelector((state: IRootState) => state.themeAdminConfig);
    const dispatch = useDispatch();
    const [isOpenGuide, setIsOpenGuide] = useState<boolean>(false);

    return (
        <div className="">
            <Tab.Group>
                <Tab.List className="panel mt-3 flex flex-wrap">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                Tham số
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                Cấu hình
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <GuideBox />
                            <ClientSetting />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <AdminSetting />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default Setting;
