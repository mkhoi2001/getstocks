import { Tab } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { UserFilter, OrderFilter, ItemFilter } from './index';

type Props = {};

export const TabFilter = (props: Props) => {
    return (
        <div className="panel p-2 pt-1">
            <div className="px-2">
                <div className="flex items-center justify-between">{/* <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5> */}</div>
                <Tab.Group>
                    <Tab.List className="mt-3 flex flex-wrap">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'text-secondary !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                >
                                    Người dùng
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
                                    Lượt nạp
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
                                    Lượt tải
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <UserFilter />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <OrderFilter />
                            </div>
                        </Tab.Panel>

                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <ItemFilter />
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
};

export default TabFilter;
