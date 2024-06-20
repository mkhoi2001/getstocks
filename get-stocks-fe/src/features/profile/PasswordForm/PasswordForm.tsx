import { useRef, useState } from 'react';
import { Field, Form, Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { User } from '../../../types/user';
import { useTranslation } from 'react-i18next';

type Props = {
    mutation: any;
    isLoading: boolean;
    isSuccess: boolean;
    user: User | null;
};

export const PasswordForm = ({ mutation, isLoading, isSuccess, user }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const SubmittedForm = Yup.object().shape({
        password: Yup.string().required(t('password_required')),
        newPassword: Yup.string().min(6, '').required(t('password_required')),
        confirmPassword: Yup.string()
            .required(t('confirm_password_required'))
            .test('passwords-match', t('password_not_match'), function (value) {
                return this.parent.newPassword === value;
            }),
    });

    const formikFormRef = useRef<any>(null);

    const handleSubmitForm = () => {
        setIsOpen(true);
    };

    const submitForm = async () => {
        mutation({ id: user?.id, password: formikFormRef?.current?.values?.password, newPassword: formikFormRef?.current?.values?.newPassword });
        formikFormRef?.current?.handleReset();
        formikFormRef?.current?.setSubmitting(false);
    };

    return (
        <div>
            <div className="m-5"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="panel">
                    <Formik
                        innerRef={formikFormRef}
                        className=" shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none p-5"
                        initialValues={{
                            newPassword: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={SubmittedForm}
                        onSubmit={handleSubmitForm}
                        enableReinitialize={true}
                    >
                        {({ errors, submitCount, touched, setValues, isSubmitting }) => (
                            <Form className="space-y-5">
                                <h6 className="text-lg font-bold mb-5">{t('change_password')}</h6>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className={!isSuccess && submitCount ? (errors.password ? 'has-error' : '') : ''}>
                                        <label htmlFor="Password"></label>
                                        <Field name="password" type="password" id="Password" placeholder="..." className="form-input" />

                                        {submitCount ? errors.password ? <div className="text-danger mt-1">{errors?.password}</div> : '' : ''}
                                    </div>
                                    <div className={!isSuccess && submitCount ? (errors.newPassword ? 'has-error' : '') : ''}>
                                        <label htmlFor="newPassword">{t('new_password')}</label>
                                        <Field name="newPassword" type="password" id="Password" placeholder="..." className="form-input" />

                                        {submitCount ? errors.newPassword ? <div className="text-danger mt-1">{errors?.newPassword}</div> : '' : ''}
                                    </div>
                                    <div className={!isSuccess && submitCount ? (errors.confirmPassword ? 'has-error' : '') : ''}>
                                        <label htmlFor="ConfirmPassword">{t('confirm_pass')}</label>
                                        <Field name="confirmPassword" type="password" id="ConfirmPassword" placeholder="..." className="form-input" />

                                        {submitCount ? errors.confirmPassword ? <div className="text-danger mt-1">{errors?.confirmPassword}</div> : '' : ''}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-5 justify-center">
                                    <button type="submit" className={`${isSubmitting ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`}>
                                        {isSubmitting ? (
                                            <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                        ) : (
                                            ''
                                        )}
                                        {t('save')}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            {isOpen ? <ConfirmModal isOpen={isOpen} setIsOpen={setIsOpen} title={t('change_password')} message={t('confirm_submit')} handleSubmit={submitForm} data={<></>} /> : null}
        </div>
    );
};

export default PasswordForm;
