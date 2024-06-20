import { Momo } from '../../../types/momo';
import { Field, Form, Formik } from 'formik';
import { formatDateTime } from '../../../utils/formatDate';
import { ConfirmModal } from '../../../components';
import * as Yup from 'yup';
import { useState } from 'react';
import { changeMomoStatus } from '../../../services/momoService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type Props = {
    momo?: Momo;
    mutation: any;
    isSuccess: boolean;
    isLoading: boolean;
};

export const WalletForm = ({ momo, mutation, isSuccess, isLoading }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<Momo | undefined>(undefined);
    const queryClient = useQueryClient();

    const {
        mutate: updateMomoMutation,
        isSuccess: isSuccessUpdate,
        isLoading: isLoadingUpdate,
    } = useMutation({
        mutationFn: changeMomoStatus,
        onSuccess: (data: any) => {
            queryClient.setQueriesData(['momoId', momo?.id], (oldData: any) => ({ ...oldData, data: { ...oldData?.data, ...data?.data } }));
            toast.success('Cập nhật thông tin thành công!');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Ops! Đã có lỗi xảy ra');
        },
    });

    const SubmittedForm = Yup.object().shape({
        host: Yup.string().notRequired(),
        phone: Yup.string()
            .required('Vui lòng nhập tên số điện thoại')
            // .max(11, 'Số điện thoại tối đa 11 kí tự')
            .min(10, 'Số điện thoại tối thiểu 10 kí tự')
            .matches(/^[0-9]+$/, 'Số điện thoại không được có kí tự đặc biệt'),
        username: Yup.string()
            .required('Vui lòng nhập tên chủ thẻ')
            .max(50, 'Tên tối đa 50 kí tự')
            .matches(
                /^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                'Họ không được có số và kí tự đặc biệt'
            ),
    });

    const handleChangeStatus = () => {
        updateMomoMutation(momo?.id);
    };

    const submitFormUpdate = (data: any) => {
        data.id = momo?.id;
        setDataUpdate(data);
        setIsOpen(true);
    };

    const handleSubmit = () => {
        mutation(dataUpdate);
    };

    return (
        <div>
            {isOpen ? <ConfirmModal handleSubmit={handleSubmit} isOpen={isOpen} setIsOpen={setIsOpen} title={'Bạn có chắc chắn không?'} message={'Đây là những thông tin nhạy cảm'} /> : ''}
            {isChangeStatus ? (
                <ConfirmModal handleSubmit={handleChangeStatus} isOpen={isChangeStatus} setIsOpen={setIsChangeStatus} title={'Bạn có chắc chắn không?'} message={'Đây là những thông tin nhạy cảm'} />
            ) : (
                ''
            )}
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    host: momo?.host || '',
                    username: momo?.username || '',
                    phone: momo?.phone || '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={submitFormUpdate}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, isSubmitting, handleReset, values }) => (
                    <Form className="space-y-5">
                        <h6 className="text-lg font-bold mb-5">Thông tin momo</h6>
                        <p className="italic">
                            <span className="text-rose-700">*</span> bắt buộc
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
                            <button onClick={() => setIsChangeStatus(true)} type="button" className="ml-3 btn btn-info ">
                                {momo?.isActive ? 'Tắt hoat động' : 'Bật hoạt động'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ID">ID</label>
                                <Field disabled name="id" value={momo?.id || ''} type="text" id="ID" placeholder="ID" className="bg-slate-100 text-slate-500 form-input hover:cursor-auto" />
                            </div>
                            <div>
                                <label htmlFor="isActive">Trạng thái</label>
                                <Field
                                    disabled
                                    name="isActive"
                                    value={momo?.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                    type="text"
                                    placeholder="Trạng thái"
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.username ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="username">
                                    Tên chủ thẻ <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="username"
                                    type="text"
                                    id="username"
                                    placeholder="Tên chủ thẻ"
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.username ? <div className="text-danger mt-1">{errors.username}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.phone ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="phone">
                                    Số điện thoại <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="phone"
                                    type="text"
                                    id="phone"
                                    placeholder="Số điện thoại"
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.phone ? <div className="text-danger mt-1">{errors.phone}</div> : '' : ''}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.host ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="host">
                                    API <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="host"
                                    type="text"
                                    id="host"
                                    placeholder="Nguồn"
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.host ? <div className="text-danger mt-1">{errors.host}</div> : '' : ''}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="createdAt">Ngày tạo</label>
                                <Field
                                    disabled
                                    name="createdAt"
                                    value={momo?.createdAt ? formatDateTime(momo?.createdAt) : ''}
                                    type="text"
                                    id="createdAt"
                                    placeholder="Ngày tạo"
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                            <div>
                                <label htmlFor="updatedAt">Ngày cập nhật</label>
                                <Field
                                    disabled
                                    name="updatedAt"
                                    value={momo?.updatedAt ? formatDateTime(momo?.updatedAt) : ''}
                                    type="text"
                                    id="updatedAt"
                                    placeholder="Ngày Cập nhật"
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-5 justify-center">
                            <button type="submit" className={`${!isEdit || isLoading ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`} disabled={!isEdit || isLoading}>
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

export default WalletForm;
