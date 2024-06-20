import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { BankPage, WalletPage } from '../../../features/bank';

type Props = {};

const Dashboard = (props: Props) => {
    return (
        <div>
            <div className="panel">
                <Tab.Group>
                    <Tab.List className="mt-3 flex flex-wrap">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected ? 'text-secondary !outline-none before:!w-full' : ''
                                    } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                >
                                    Ngân hàng
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
                                    Ví điện tử
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <BankPage />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <WalletPage />
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
};

export default Dashboard;
