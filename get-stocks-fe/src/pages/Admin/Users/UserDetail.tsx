import { Tab } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { AdminRoutes } from '../../../router/routes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, updateUserInfo, minusBalance, plusBalance, resetPassword } from '../../../services/userService';
import { UserForm, PasswordForm, ActiveForm, MoneyForm, ItemHistoryList, OrderList } from './Components';
import toast from 'react-hot-toast';
import { DataAmount } from '../../../types/user';
import { ToastType, useToast } from '../../../hooks';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';

type Props = {};

export type MutationParam = {
    id: string;
    data: DataAmount[];
};

export const UserDetail = (props: Props) => {
    const { t } = useTranslation();

    const { showToast } = useToast();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { id } = useParams();
    if (!id) {
        navigate(AdminRoutes.USER);
    }

    useEffect(() => {
        dispatch(setPageTitle(t('users')));
    }, []);

    const { data: userInfo } = useQuery({
        queryKey: ['userId', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
        onError: (error) => {
            showToast(ToastType.ERROR, t('user_not_found_with_id'));
            navigate(AdminRoutes.USER);
        },
    });

    const queryClient = useQueryClient();

    const { mutate: resetPasswordMutation, isSuccess: isSuccessReset } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            showToast(ToastType.SUCCESS, t('update_success'));
        },
        onError: (error: any) => {
            showToast(ToastType.ERROR, error?.message || t('has_error'));
        },
    });

    const {
        mutate: minusBalanceMutation,
        isLoading: isLoadingMinus,
        isSuccess: isSuccessMinus,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: (mutationParams: MutationParam) => minusBalance(mutationParams.data, mutationParams.id),
        onSuccess: (data: any) => {
            queryClient.setQueryData(['userId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            showToast(ToastType.SUCCESS, t('update_success'));

            // queryClient.invalidateQueries({ queryKey: ['userId', id] });
        },
        onError: (error: any) => {
            showToast(ToastType.ERROR, error?.message || t('has_error'));
        },
    });

    const {
        mutate: plusBalanceMutation,
        isLoading: isLoadingPlus,
        isSuccess: isSuccessPlus,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: (mutationParams: MutationParam) => plusBalance(mutationParams.data, mutationParams.id),
        onSuccess: (data: any) => {
            queryClient.setQueryData(['userId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            // queryClient.invalidateQueries({ queryKey: ['userId', id] });
            showToast(ToastType.SUCCESS, t('update_success'));
        },
        onError: (error: any) => {
            showToast(ToastType.ERROR, error?.message || t('has_error'));
        },
    });

    const {
        mutate: updateInfoMutation,
        isLoading,
        isSuccess,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: updateUserInfo,
        onSuccess: (data: any) => {
            // refetch();
            queryClient.setQueryData(['userId', id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            showToast(ToastType.SUCCESS, t('update_success'));

            // queryClient.invalidateQueries({ queryKey: ['userId', id] });
        },
        onError: (error: any) => {
            showToast(ToastType.ERROR, error?.message || t('has_error'));
        },
    });

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                {/* <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5> */}
                <Link to={AdminRoutes.USER} className="hover:cursor-pointer">
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                {t('infomation')}
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
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                {t('item_download_history')}
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
                                {t('plus_minus')}
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
                                {t('password')}
                            </button>
                        )}
                    </Tab>

                    {/* <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'text-secondary !outline-none before:!w-full' : ''
                                } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                Hoạt động
                            </button>
                        )}
                    </Tab> */}
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <UserForm isLoading={isLoading} isSuccess={isSuccess} user={userInfo?.data} updateInfoMutation={updateInfoMutation} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <OrderList id={id ? id : ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <ItemHistoryList id={id ? id : ''} />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <MoneyForm
                                isLoadingPlus={isLoadingPlus}
                                isLoadingMinus={isLoadingMinus}
                                isSuccessPlus={isSuccessPlus}
                                isSuccessMinus={isSuccessMinus}
                                user={userInfo?.data}
                                plusMutation={plusBalanceMutation}
                                minusMutation={minusBalanceMutation}
                            />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="pt-5 p-2">
                            <PasswordForm isSuccessReset={isSuccessReset} user={userInfo?.data} resetPasswordMutation={resetPasswordMutation} />
                        </div>
                    </Tab.Panel>

                    {/* <Tab.Panel>
                        <div className="pt-5 p-2">
                            <ActiveForm />
                        </div>
                    </Tab.Panel> */}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default UserDetail;
