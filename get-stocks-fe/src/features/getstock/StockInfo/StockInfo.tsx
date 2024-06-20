import { formatDateTime } from '../../../utils/formatDate';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { System } from '../../../types/system';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getNewAccessToken, getBalance } from '../../../services/getStockService';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { ConfirmModal } from '../../../components';

type Props = {
    system?: System;
    isSuccess: boolean;
    isLoading: boolean;
    mutation: any;
};

export const StockInfo = ({ system, isSuccess, isLoading, mutation }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isEditToken, setIsEditToken] = useState<boolean>(false);
    const [isEditBalance, setIsEditBalance] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<System | undefined>(undefined);

    const queryClient = useQueryClient();

    const {
        mutate: getNewAccessTokenMutation,
        isLoading: isLoadingGetToken,
        isSuccess: isSuccessUpdateToken,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: getNewAccessToken,
        onSuccess: (data: any) => {
            queryClient.setQueryData(['getstocks', system?.id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    const {
        mutate: getBalanceMutation,
        isLoading: isLoadingGetBalance,
        isSuccess: isSuccessUpdateBalance,
    }: { error: any; mutate: any; isLoading: boolean; isSuccess: boolean } = useMutation({
        mutationFn: getBalance,
        onSuccess: (data: any) => {
            queryClient.setQueryData(['getstocks', system?.id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên').max(50, 'Tên tối đa 50 kí tự'),
        host: Yup.string().required('Vui lòng nhập host').max(100, 'Tên tối đa 100 kí tự'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        usename: Yup.string().nullable(),
        token: Yup.string().nullable(),
        password: Yup.string().nullable(),
        balance: Yup.number().typeError('Vui lòng nhập số').min(0, 'Giá trị phải lớn hơn 0').nullable(),
    });

    const submitFormUpdate = (data: any) => {
        data.id = system?.id;
        setDataUpdate(data);
        // mutation(data);
        setIsOpen(true);
    };

    const handleSubmit = () => {
        mutation(dataUpdate);
    };

    return (
        <div>
            {isOpen ? <ConfirmModal handleSubmit={handleSubmit} isOpen={isOpen} setIsOpen={setIsOpen} title={'Bạn có chắc chắn không?'} message={'Đây là những thông tin nhạy cảm'} /> : ''}
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    name: system?.name || '',
                    host: system?.host || '',
                    email: system?.email || '',
                    username: system?.username || '',
                    token: system?.token || '',
                    balance: system?.balance || 0,
                    password: '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={submitFormUpdate}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, isSubmitting, handleReset }) => (
                    <Form className="space-y-5">
                        <h6 className="text-lg font-bold mb-5">Thông tin hệ thống getstocks</h6>
                        <p className="italic">
                            <span className="text-rose-700">*</span> bắt buộc
                            <br />
                            <span className="inline-block mt-1 text-rose-700">**</span> thông tin nhạy cảm
                        </p>
                        <div className="flex items-center gap-2">
                            <label className="w-12 h-6 relative">
                                <input
                                    onChange={(e) => setIsEdit(e.target.checked)}
                                    type="checkbox"
                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                    id="custom_switch_checkbox1"
                                />
                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                            </label>
                            <label className="text-lg ">Chỉnh sửa</label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ID">ID</label>
                                <Field disabled name="id" value={system?.id || ''} type="text" id="ID" placeholder="ID" className="bg-slate-100 text-slate-500 form-input hover:cursor-auto" />
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="name">
                                    Tên <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="..."
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.name ? <div className="text-danger mt-1">{errors?.name}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.host ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="host">
                                    Host <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="host"
                                    type="text"
                                    id="host"
                                    placeholder="..."
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.host ? <div className="text-danger mt-1">{errors?.host}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.email ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="email">
                                    Email <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="email"
                                    type="text"
                                    id="email"
                                    placeholder="..."
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.email ? <div className="text-danger mt-1">{errors?.email}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && isEdit ? (errors.username ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="username">
                                    Username <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="username"
                                    type="text"
                                    id="username"
                                    placeholder="..."
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.username ? <div className="text-danger mt-1">{errors?.username}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.password ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="password">
                                    Mật khẩu <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="password"
                                    type="password"
                                    id="password"
                                    placeholder="..."
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.password ? <div className="text-danger mt-1">{errors?.password}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.token ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="token">
                                    Token <span className="text-rose-700">**</span>
                                </label>
                                <div className="">
                                    <Field
                                        disabled={!isEdit || isLoading || !isEditToken}
                                        name="token"
                                        type="text"
                                        id="token"
                                        placeholder="..."
                                        className={`form-input ${!isEdit || isLoading || !isEditToken ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        className={`${isLoadingGetToken ? 'opacity-20' : 'opacity-100'} btn btn-info w-42 mt-2`}
                                        disabled={isLoadingGetToken}
                                        onClick={() => getNewAccessTokenMutation(system?.id)}
                                    >
                                        {isLoadingGetToken ? (
                                            <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                        ) : (
                                            ''
                                        )}
                                        Lấy token mới
                                    </button>
                                    <div className="mt-3 flex gap-2 items-center">
                                        <label className="w-12 h-6 relative">
                                            <input
                                                onChange={(e) => setIsEditToken(e.target.checked)}
                                                type="checkbox"
                                                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                id="custom_switch_checkbox1"
                                            />
                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                        </label>
                                        <label className="text-md ">Nhập bằng tay</label>
                                    </div>
                                </div>
                                {submitCount && isEdit ? errors.token ? <div className="text-danger mt-1">{errors?.token}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.balance ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="balance">
                                    Số dư <span className="text-rose-700">**</span>
                                </label>
                                <div>
                                    <Field
                                        disabled={!isEdit || isLoading || !isEditBalance}
                                        name="balance"
                                        type="number"
                                        id="balance"
                                        placeholder="..."
                                        className={`form-input ${!isEdit || isLoading || !isEditBalance ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                    />
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            className={`${isLoadingGetBalance ? 'opacity-20' : 'opacity-100'} btn btn-info w-42 mt-2`}
                                            disabled={isLoadingGetBalance}
                                            onClick={() => getBalanceMutation(system?.id)}
                                        >
                                            {isLoadingGetBalance ? (
                                                <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                            ) : (
                                                ''
                                            )}
                                            Lấy số dư mới
                                        </button>
                                        <div className="mt-3 flex gap-2 items-center">
                                            <label className="w-12 h-6 relative">
                                                <input
                                                    onChange={(e) => setIsEditBalance(e.target.checked)}
                                                    type="checkbox"
                                                    className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                    id="custom_switch_checkbox1"
                                                />
                                                <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                            </label>
                                            <label className="text-md ">Nhập bằng tay</label>
                                        </div>
                                    </div>
                                </div>

                                {submitCount && isEdit ? errors.balance ? <div className="text-danger mt-1">{errors?.balance}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="createdAt">Ngày tạo</label>
                                <Field
                                    disabled
                                    name="createdAt"
                                    value={system?.createdAt ? formatDateTime(system?.createdAt) : ''}
                                    type="text"
                                    id="createdAt"
                                    placeholder="Ngày tạo"
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                            <div>
                                <label htmlFor="updatedAt">Ngày cập nhật mới nhất</label>
                                <Field
                                    disabled
                                    name="updatedAt"
                                    value={system?.updatedAt ? formatDateTime(system?.updatedAt) : ''}
                                    type="text"
                                    id="updatedAt"
                                    placeholder="Ngày cập nhật"
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-5 justify-center">
                            <button
                                type="submit"
                                className={`${!isEdit || isLoading || isLoadingGetToken || isLoadingGetBalance ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`}
                                disabled={!isEdit || isLoading || isLoadingGetToken || isLoadingGetBalance}
                            >
                                {isLoading ? (
                                    <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                ) : (
                                    ''
                                )}
                                Lưu
                            </button>
                            <button type="button" onClick={handleReset} className={`${!isEdit ? 'opacity-20' : 'opacity-100'} btn btn-danger !mt-6`} disabled={!isEdit || isSubmitting}>
                                Reset
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default StockInfo;
