import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Select from 'react-select';
import { OrderStatus } from '../../../../../types/order';

type Props = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    message: any;
    title: string;
    data?: any;
    handleSubmit: any;
};

type Option = {
    value: OrderStatus;
    label: string;
};

const optionsStatus: Option[] = [
    { value: OrderStatus.FAIL, label: 'Thất bại' },
    { value: OrderStatus.SUCCESS, label: 'Thành công' },
];

export const StatusForm = ({ isOpen, setIsOpen, message, title = '', data, handleSubmit }: Props) => {
    const [value, setValue] = useState<{ value: OrderStatus; label: string }>(optionsStatus[0]);
    const [reason, setReason] = useState<string>('');

    const onSubmit = () => {
        setIsOpen(false);
        handleSubmit(value, reason);
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
                                        <div>{message}</div>
                                        <Select
                                            onChange={(item) => setValue(item as { value: OrderStatus; label: string })}
                                            className="my-5 mb-10"
                                            defaultValue={value}
                                            options={optionsStatus}
                                            isSearchable={false}
                                        />
                                        {value.value === OrderStatus.FAIL ? (
                                            <form>
                                                <input value={reason} onChange={(e) => setReason(e.target.value)} name="reason" type="text" placeholder="Nhập lí do." className="form-input" required />
                                            </form>
                                        ) : (
                                            ''
                                        )}

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setIsOpen(false)}>
                                                Hủy
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={onSubmit}>
                                                Xác nhận
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

export default StatusForm;
