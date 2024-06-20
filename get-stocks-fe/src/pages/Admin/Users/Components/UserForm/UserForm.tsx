import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { User } from '../../../../../types/user';
import { formatDateTime } from '../../../../../utils/formatDate';
import { useTranslation } from 'react-i18next';

type Props = {
    user?: User;
    updateInfoMutation: any;
    isSuccess: boolean;
    isLoading: boolean;
};

export const UserForm = ({ user, updateInfoMutation, isSuccess, isLoading }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { t } = useTranslation();

    const SubmittedForm = Yup.object().shape({
        firstName: Yup.string()
            .optional()
            .max(50, t('max_name_50'))
            .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/, t('first_name_invalid')),
        lastName: Yup.string()
            .optional()
            .max(50, t('max_last_name_50'))
            .matches(/^[\sa-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹếẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/, t('last_name_invalid')),
        username: Yup.string()
            .optional()
            .min(6, t('username_min'))
            .max(50, t('username_max'))
            .matches(/^[a-zA-Z0-9]+$/, t('username_invalid')),
        phone: Yup.string()
            .matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, t('phone_invalid'))
            .optional(),
    });

    const submitForm = (data: any) => {
        if (!data.id) data.id = user?.id;
        data.username = data.username.trim();
        data.firstName = data.firstName.trim();

        let lastName = data.lastName;
        // let namearr = lastName;
        // namearr.forEach((item: string) => {
        //     item = item.trim().replace(/\s+/g, '');
        //     if (item.length > 0) {
        //         lastName += item + ' ';
        //     }
        // });
        lastName = lastName.trim();
        data.lastName = lastName;
        updateInfoMutation(data);
    };

    return (
        <div>
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    firstName: user?.firstName || '',
                    lastName: user?.lastName || '',
                    username: user?.username || '',
                    phone: user?.phone || '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={submitForm}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, handleReset }) => (
                    <Form className="space-y-5">
                        <h6 className="text-lg font-bold mb-5">{t('personal_info')}</h6>
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
                            <label className="text-lg ">{t('edit')}</label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ID">ID</label>
                                <Field disabled name="id" type="text" value={user?.id || ''} id="ID" placeholder="ID" className="bg-slate-100 text-slate-500 form-input hover:cursor-auto" />
                            </div>
                            <div>
                                <label htmlFor="Email">Email</label>
                                <Field disabled name="email" value={user?.email || ''} type="text" placeholder="Email" className="bg-slate-100 text-slate-500 form-input hover:cursor-auto" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.username ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="username">Username</label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="username"
                                    type="text"
                                    id="username"
                                    placeholder="Username..."
                                    className={`form-input ${!isEdit ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.username ? <div className="text-danger mt-1">{errors.username}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.phone ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="SDT">{t('phone')}</label>

                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="phone"
                                    type="text"
                                    id="SDT"
                                    placeholder={t('phone')}
                                    className={`form-input ${!isEdit ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.phone ? <div className="text-danger mt-1">{errors.phone}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.firstName ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="FirstName">{t('first_name')}</label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="firstName"
                                    type="text"
                                    id="FirstName"
                                    placeholder={t('first_name')}
                                    className={`form-input ${!isEdit ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.firstName ? <div className="text-danger mt-1">{errors.firstName}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.lastName ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="FirstName">{t('last_name')}</label>

                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="lastName"
                                    type="text"
                                    id="LastName"
                                    placeholder={t('last_name')}
                                    className={`form-input ${!isEdit ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.lastName ? <div className="text-danger mt-1">{errors.lastName}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="balanceG">{t('num_g')}</label>

                                <Field
                                    disabled
                                    value={user?.balanceG?.toFixed(2) || '0'}
                                    name="balanceG"
                                    type="text"
                                    id="balanceG"
                                    placeholder={t('num_g')}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                            <div>
                                <label htmlFor="balanceP">{t('num_p')}</label>
                                <Field
                                    disabled
                                    value={user?.balanceP?.toFixed(2) || '0'}
                                    name="balanceP"
                                    type="text"
                                    id="balanceP"
                                    placeholder={t('num_p')}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="totalDeposit">{t('total_payment')}</label>

                                <Field
                                    disabled
                                    value={user?.totalDeposit?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0, maximumFractionDigits: 2 }) || '0'}
                                    name="totalDeposit"
                                    type="text"
                                    id="totalDeposit"
                                    placeholder={t('total_payment')}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                            <div>
                                <label htmlFor="role">{t('role')}</label>
                                <Field
                                    disabled
                                    value={user?.role || 'USER'}
                                    name="role"
                                    type="text"
                                    id="role"
                                    placeholder={t('role')}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="createdDate">{t('register_date')}</label>
                                <Field
                                    disabled
                                    value={user?.createdAt ? formatDateTime(user?.createdAt) : ''}
                                    name="createdDate"
                                    type="text"
                                    id="createdDate"
                                    placeholder={t('register_date')}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                            <div>
                                <label htmlFor="updatedDate">{t('updated_date')}</label>
                                <Field
                                    disabled
                                    value={user?.updatedAt ? formatDateTime(user?.updatedAt) : ''}
                                    name="updatedDate"
                                    type="text"
                                    id="updatedDate"
                                    placeholder={t('updated_date')}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="lastLogin">{'Lần cuối hoạt động'}</label>
                                <Field
                                    disabled
                                    value={user?.lastLogin ? formatDateTime(user?.lastLogin) : ''}
                                    name="lastLogin"
                                    type="text"
                                    id="lastLogin"
                                    placeholder={'Lần cuối hoạt động'}
                                    className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-5 justify-center">
                            <button type="submit" className={`${!isEdit ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`} disabled={!isEdit || isLoading}>
                                {isLoading ? (
                                    <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                ) : (
                                    ''
                                )}
                                {t('save')}
                            </button>
                            <button type="button" onClick={() => handleReset()} className={`${!isEdit ? 'opacity-20' : 'opacity-100'} btn btn-danger !mt-6`} disabled={!isEdit || isLoading}>
                                Reset
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UserForm;
