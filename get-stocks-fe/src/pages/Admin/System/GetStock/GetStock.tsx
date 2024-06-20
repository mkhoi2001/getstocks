import { useState, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSystemById, updateSystem } from '../../../../services/systemService';
import toast from 'react-hot-toast';
import { System } from '../../../../types/system';
import { Tab } from '@headlessui/react';
import { StockInfo, StockProvider, StockOrder } from '../../../../features/getstock';
import { getDefaultDataByType } from '../../../../services/defaultService';

type Props = {};

export const GetStock = ({}: Props) => {
    const [id, setId] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const queryClient = useQueryClient();

    useQuery({
        queryKey: ['systemDefault'],
        queryFn: () => getDefaultDataByType('getstocks'),
        onSuccess: (data) => {
            if (data?.data?.dataId) {
                setId(data?.data?.dataId);
            }
        },
        onError: (error) => {
            // toast.error('Không tìm thấy system');
        },
    });

    const { data: systemData } = useQuery({
        queryKey: ['getstocks', id],
        queryFn: () => getSystemById(id),
        enabled: !!id,
        onSuccess: (data) => {},
    });

    const {
        mutate: updateSystemMutation,
        isLoading: isLoadingUpdate,
        isSuccess: isSuccessUpdate,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: updateSystem,
        onSuccess: (data: any) => {
            queryClient.setQueriesData(['getstocks', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    return (
        <>
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
                                    Thông tin
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
                                    Item
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
                                    Lịch sử nạp
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <StockInfo mutation={updateSystemMutation} system={systemData?.data} isLoading={isLoadingUpdate} isSuccess={isSuccessUpdate} />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <StockProvider system={systemData?.data} />
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="pt-5 p-2">
                                <StockOrder system={systemData?.data} />
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    );
};

export default GetStock;
