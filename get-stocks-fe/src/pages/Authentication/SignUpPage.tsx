import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect } from 'react';
import { AppRoutes } from '../../router/routes';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { signUp } from '../../services/authService';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';

type SignUpInfo = {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

const SignUpPage = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Đăng ký'));
    });
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;

    const SubmittedForm = Yup.object().shape({
        username: Yup.string().min(6, 'Must be at least 6 characters long').required('Please fill the Username'),
        email: Yup.string().email('Invalid email').required('Please fill the Email'),
        password: Yup.string().min(6, 'Must be at least 6 characters long').required('Please fill the Password'),
        confirmPassword: Yup.string()
            .required('Please fill the Confirm Password')
            .test('passwords-match', 'Passwords must match', function (value) {
                return this.parent.password === value;
            }),
    });

    const {
        error,
        mutate: signUpMutation,
        isLoading,
    }: { error: any; mutate: any; isLoading: boolean } = useMutation({
        mutationFn: signUp,
        onSuccess: (data: any) => {
            toast.success('Sign up successful');
            navigate(AppRoutes.SIGN_IN);
        },
    });

    const submitForm = (data: SignUpInfo) => {
        if (!isChecked) {
            toast.error('Please confirm our policy');
            return;
        }

        signUpMutation({ email: data.email, username: data.username, password: data.password });
    };

    return (
        <div>
            <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
                <div className="panel sm:w-[480px] m-6 max-w-lg w-full">
                    <h2 className="font-bold text-2xl mb-3">Đăng ký</h2>

                    <Formik
                        className="space-y-5"
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={SubmittedForm}
                        onSubmit={submitForm}
                    >
                        {({ errors, submitCount, touched }) => (
                            <Form className="space-y-5">
                                <div className={submitCount ? (errors.username ? 'has-error' : '') : ''}>
                                    <label htmlFor="username">User Name </label>
                                    <Field name="username" type="text" id="username" placeholder="" className="form-input" />

                                    {submitCount ? errors.username ? <div className="text-danger mt-1">{errors.username}</div> : '' : ''}
                                </div>
                                <div className={submitCount ? (errors.email ? 'has-error' : '') : ''}>
                                    <label htmlFor="Email">Email</label>
                                    <Field name="email" type="text" id="Email" placeholder="" className="form-input" />

                                    {submitCount ? errors.email ? <div className="text-danger mt-1">{errors.email}</div> : '' : ''}
                                </div>

                                <div className={submitCount ? (errors.password ? 'has-error' : '') : ''}>
                                    <label htmlFor="Password">Mật khẩu</label>
                                    <Field name="password" type="password" id="Password" placeholder="" className="form-input" />

                                    {submitCount ? errors.password ? <div className="text-danger mt-1">{errors.password}</div> : '' : ''}
                                </div>
                                <div className={submitCount ? (errors.confirmPassword ? 'has-error' : '') : ''}>
                                    <label htmlFor="ConfirmPassword">Xác nhận mật khẩu</label>
                                    <Field name="confirmPassword" type="password" id="ConfirmPassword" placeholder="" className="form-input" />

                                    {submitCount ? errors.confirmPassword ? <div className="text-danger mt-1">{errors.confirmPassword}</div> : '' : ''}
                                </div>
                                <div>
                                    <label className="cursor-pointer">
                                        <input onChange={(e) => setIsChecked(e.target.checked)} type="checkbox" className="form-checkbox" />
                                        <span className="text-white-dark">
                                            Tôi đồng ý với{' '}
                                            <button type="button" className="text-primary hover:underline">
                                                Chính sách và điều khoản
                                            </button>
                                        </span>
                                    </label>
                                </div>
                                <button className="btn btn-primary w-full">ĐĂNG KÍ</button>
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
                        Đã có tài khoản ?
                        <Link to={AppRoutes.SIGN_IN} className="font-bold text-primary hover:underline ltr:ml-1 rtl:mr-1">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
