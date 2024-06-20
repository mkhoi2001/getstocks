import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { ProfileForm, PasswordForm } from '../../../features/profile';
import { Tab } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { updateUserInfo, changePassword } from '../../../services/userService';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUserInfo as updateUser } from '../../../store/userSlice';

type Props = {};

const AdminInfo = (props: Props) => {
    const user = useSelector((state: IRootState) => state.user.data.info);
    const dispatch = useDispatch();

    const {
        mutate: updateInfoMutation,
        isLoading: isLoadingInfo,
        isSuccess: isSuccessInfo,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: updateUserInfo,
        onSuccess: (data: any) => {
            dispatch(updateUser(data.data));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    const {
        mutate: changePasswordMutation,
        isLoading: isLoadingPassword,
        isSuccess: isSuccessPassword,
    } = useMutation({
        mutationFn: changePassword,
        onSuccess: (data: any) => {
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    return (
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
                                Mật khẩu
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <ProfileForm mutation={updateInfoMutation} isLoading={isLoadingInfo} isSuccess={isSuccessInfo} user={user} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <PasswordForm user={user} mutation={changePasswordMutation} isLoading={isLoadingPassword} isSuccess={isSuccessPassword} />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default AdminInfo;
