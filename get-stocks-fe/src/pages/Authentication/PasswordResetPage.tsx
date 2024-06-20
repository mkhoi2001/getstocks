import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { AppRoutes } from '../../router/routes';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { passwordReset } from '../../services/authService';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const PasswordResetPage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [second, setSecond] = useState<number>(5);

    const email = searchParams.get('email') || '';
    useEffect(() => {
        if (searchParams) {
            if (!email) {
                navigate(AppRoutes.SIGN_IN);
            }
        }
    }, [searchParams]);
    useEffect(() => {
        dispatch(setPageTitle('Mật khẩu mới'));
    }, []);
    const navigate = useNavigate();

    const {
        error,
        mutate: passwordResetMutation,
        isLoading,
    }: { error: any; mutate: any; isLoading: boolean } = useMutation({
        mutationFn: passwordReset,
        onSuccess: (data: any) => {
            toast.success('Reset mật khẩu thành công');
            navigate(`${AppRoutes.SIGN_IN}`);
        },
    });

    const SubmittedForm = Yup.object().shape({
        password: Yup.string().min(6, 'Must be at least 6 characters long').required('Please fill the Password'),
        confirmPassword: Yup.string()
            .required('Please fill the Confirm Password')
            .test('passwords-match', 'Passwords must match', function (value) {
                return this.parent.password === value;
            }),
    });

    const submitForm = (data: { password: string; confirmPassword: string }) => {
        passwordResetMutation({ email, password: data.password });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel sm:w-[480px] m-6 max-w-lg w-full">
                <h2 className="font-bold text-2xl mb-3">Nhập mật khẩu mới</h2>
                <Formik
                    className="space-y-5"
                    initialValues={{
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={SubmittedForm}
                    onSubmit={submitForm}
                >
                    {({ errors, submitCount, touched }) => (
                        <Form className="space-y-5">
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

                            <button type="submit" className="btn btn-primary w-full">
                                RESET
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

export default PasswordResetPage;
