import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { AppRoutes } from '../../router/routes';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../../services/authService';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>('');
    useEffect(() => {
        dispatch(setPageTitle('Quên mật khẩu'));
    });
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;

    const SubmittedForm = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Please fill the Email'),
    });

    const {
        error,
        mutate: forgotMutation,
        isLoading,
    }: { error: any; mutate: any; isLoading: boolean } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data: any) => {
            toast.success(data?.result?.message || 'Please check your email');
            navigate(`${AppRoutes.VERIFY_TOKEN_RESET}?email=${email}`);
        },
    });

    const submitForm = (data: { email: string }) => {
        setEmail(data.email);
        forgotMutation(data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel sm:w-[480px] m-6 max-w-lg w-full">
                <h2 className="font-bold text-2xl mb-3">Quên mật khẩu</h2>
                <p className="mb-7">Nhập email đăng ký của bạn để lấy lai mật khẩu</p>
                <Formik
                    className="space-y-5"
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={SubmittedForm}
                    onSubmit={submitForm}
                >
                    {({ errors, submitCount, touched }) => (
                        <Form className="space-y-5">
                            <div className={submitCount ? (errors.email ? 'has-error' : '') : ''}>
                                <label htmlFor="Email">Email</label>
                                <Field name="email" type="text" id="Email" placeholder="" className="form-input" />

                                {submitCount ? errors.email ? <div className="text-danger mt-1">{errors.email}</div> : '' : ''}
                            </div>

                            <button type="submit" disabled={isLoading} className={`${isLoading ? 'opacity-20' : 'opacity-100'} btn btn-primary w-full`}>
                                {isLoading ? (
                                    <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                ) : (
                                    ''
                                )}
                                <span className="text-upper">RESET</span>
                            </button>
                            <div className="text-danger mt-1">{error && error?.message ? error?.message : ''}</div>
                        </Form>
                    )}
                </Formik>

                <div className="relative my-7 h-5 text-center before:w-full before:h-[1px] before:absolute before:inset-0 before:m-auto before:bg-[#ebedf2] dark:before:bg-[#253b5c]">
                    <div className="font-bold text-white-dark bg-white dark:bg-black px-2 relative z-[1] inline-block">
                        <span>Hoặc</span>
                    </div>
                </div>
                <p className="text-center">
                    <Link to={AppRoutes.SIGN_IN} className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
