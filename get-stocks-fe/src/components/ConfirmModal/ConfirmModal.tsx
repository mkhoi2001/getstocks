import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    message: string;
    title: string;
    data?: any;
    handleSubmit: any;
};

export const ConfirmModal = ({ isOpen, setIsOpen, message, title = '', data, handleSubmit }: Props) => {
    const { t } = useTranslation();
    const onSubmit = () => {
        setIsOpen(false);
        handleSubmit();
    };
    return (
        <div className="mb-5">
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb]  h-12 dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">{title}</div>
                                        {/* <button type="button" className="text-white-dark hover:text-dark" onClick={() => setIsOpen(false)}>
                                            <svg>...</svg>
                                        </button> */}
                                    </div>
                                    <div className="p-5">
                                        <div className="pb-3 italic font-bold">{data}</div>
                                        <p>{message}</p>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setIsOpen(false)}>
                                                {t('cancel')}
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={onSubmit}>
                                                {t('confirm')}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ConfirmModal;
