import { useState } from 'react';
import { formatDateTime } from '../../../../../utils/formatDate';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PackagePricingP } from '../../../../../types/package';
import { GuideBox } from '../../../../../components';

type Props = {
    packageP?: PackagePricingP;
    isSuccess?: boolean;
    isNew?: boolean;
    mutation: any;
    isLoading?: boolean;
};

export const PackagePForm = ({ isLoading, packageP, isSuccess, isNew, mutation }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(isNew || false);

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Vui lòng nhập tên').max(50, 'Tên tối đa 50 kí tự'),
        // .matches(/^[a-zA-Z0-9]+$/, 'Tên không được có kí tự đặc biệt'),
        content: Yup.string().required('Vui lòng nhập nội dung mua').max(50, 'Tên tối đa 50 kí tự'),
        // .matches(/^[a-zA-Z0-9]+$/, 'Nội dung mua không được có kí tự đặc biệt'),
        dayExpires: Yup.number().typeError('Vui lòng nhập số nguyên').required('Vui lòng nhập dữ liệu').integer('Giá trị phải là số nguyên').positive('Giá trị phải lớn hơn 0'),
        downPerDay: Yup.number().typeError('Vui lòng nhập số nguyên').required('Vui lòng nhập dữ liệu').integer('Giá trị phải là số nguyên').positive('Giá trị phải lớn hơn 0'),
        price: Yup.number().typeError('Vui lòng nhập số nguyên').required('Vui lòng nhập dữ liệu').positive('Giá trị phải lớn hơn 0'),
    });

    const submitFormCreate = (data: any) => {
        console.log('data submit', data);
        mutation(data);
    };

    const submitFormUpdate = (data: any) => {
        data.id = packageP?.id;
        mutation(data);
    };

    return (
        <div>
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    name: packageP?.name || '',
                    content: packageP?.content || '',
                    price: packageP?.price || 0,
                    dayExpires: packageP?.dayExpires || 0,
                    downPerDay: packageP?.downPerDay || 0,
                    guideVn: packageP?.guideVn || '',
                    guideEn: packageP?.guideEn || '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={isNew ? submitFormCreate : submitFormUpdate}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, isSubmitting, handleReset }) => (
                    <Form className="space-y-5">
                        <h6 className="text-lg font-bold mb-5">Thông tin package</h6>
                        <p className="italic">
                            <span className="text-rose-700">*</span> bắt buộc
                        </p>
                        {isNew ? (
                            ''
                        ) : (
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
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isNew ? (
                                ''
                            ) : (
                                <div>
                                    <label htmlFor="ID">ID</label>
                                    <Field disabled name="id" value={packageP?.id || ''} type="text" id="ID" placeholder="ID" className="bg-slate-100 text-slate-500 form-input hover:cursor-auto" />
                                </div>
                            )}
                            <div>
                                <label htmlFor="content">Nội dung mua</label>
                                <div className={!isSuccess && submitCount && isEdit ? (errors.content ? 'has-error' : 'has-success') : ''}>
                                    <Field
                                        disabled={!isEdit || isLoading}
                                        id="content"
                                        name="content"
                                        type="text"
                                        placeholder="Nội dung mua"
                                        className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                    />
                                    {submitCount && isEdit ? errors.content ? <div className="text-danger mt-1">{errors.content}</div> : '' : ''}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="name">
                                    Tên <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Tên"
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.name ? <div className="text-danger mt-1">{errors.name}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.price ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="name">
                                    Giá <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="price"
                                    type="number"
                                    id="price"
                                    placeholder="Gia"
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.price ? <div className="text-danger mt-1">{errors.price}</div> : '' : ''}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <label htmlFor="dayExpires">Số ngày sử dụng</label>
                                    <div className={!isSuccess && submitCount && isEdit ? (errors.dayExpires ? 'has-error' : 'has-success') : ''}>
                                        <Field
                                            disabled={!isEdit || isLoading}
                                            id="dayExpires"
                                            name="dayExpires"
                                            type="number"
                                            placeholder="Ngay su dung"
                                            className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount && isEdit ? errors.dayExpires ? <div className="text-danger mt-1">{errors.dayExpires}</div> : '' : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <label htmlFor="downPerDay">Lượt down mỗi ngày</label>
                                    <div className={!isSuccess && submitCount && isEdit ? (errors.downPerDay ? 'has-error' : 'has-success') : ''}>
                                        <Field
                                            name="downPerDay"
                                            type="number"
                                            placeholder="down moi ngay"
                                            disabled={!isEdit || isLoading}
                                            id="downPerDay"
                                            className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount && isEdit ? errors.downPerDay ? <div className="text-danger mt-1">{errors.downPerDay}</div> : '' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isEdit ? (
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                <GuideBox />
                            </div>
                        ) : (
                            ''
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                            <div className="">
                                <label htmlFor="guideVn">Box tiếng việt</label>
                                <div>
                                    <Field
                                        as={'textarea'}
                                        disabled={!isEdit || isLoading}
                                        id="guideVn"
                                        name="guideVn"
                                        type="text"
                                        placeholder="..."
                                        className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                    />
                                </div>
                            </div>
                            <div className="">
                                <label htmlFor="guideEn">Box tiếng anh</label>
                                <div>
                                    <Field
                                        as={'textarea'}
                                        name="guideEn"
                                        type="text"
                                        placeholder="..."
                                        disabled={!isEdit || isLoading}
                                        id="guideEn"
                                        className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                        {isNew ? (
                            ''
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="createdAt">Ngày tạo</label>
                                    <Field
                                        disabled
                                        name="createdAt"
                                        value={packageP?.createdAt ? formatDateTime(packageP?.createdAt) : ''}
                                        type="text"
                                        id="ID"
                                        placeholder="Ngày tạo"
                                        className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="updatedAt">Ngày cập nhật</label>
                                    <Field
                                        disabled
                                        name="updatedAt"
                                        value={packageP?.updatedAt ? formatDateTime(packageP?.updatedAt) : ''}
                                        type="text"
                                        id="ID"
                                        placeholder="Ngày tạo"
                                        className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                    />
                                </div>
                            </div>
                        )}

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

export default PackagePForm;
