import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../../../services/authService';
import { useEffect } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { setAccessToken } from '../../../store/userSlice';
import { AdminRoutes, AppRoutes } from '../../../router/routes';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

type Props = {};

type LoginInfo = {
    email: string;
    password: string;
};

const SignInPage = (props: Props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Đăng nhập'));
    }, []);
    const navigate = useNavigate();

    const {
        error,
        mutate: loginAdminMutation,
        isLoading,
    }: { error: any; mutate: any; isLoading: boolean } = useMutation({
        mutationFn: loginAdmin,
        onSuccess: (data: any) => {
            dispatch(setAccessToken(data?.data?.token));
            navigate(AdminRoutes.DASHBOARD_ADMIN);
        },
    });

    const SubmittedForm = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Please fill the Email'),
        password: Yup.string().required('Please fill the Password'),
    });

    const submitForm = (data: LoginInfo) => {
        loginAdminMutation(data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel sm:w-[480px] m-6 max-w-lg w-full">
                <h2 className="font-bold text-2xl mb-3">Đăng Nhập</h2>

                <Formik
                    className="space-y-5"
                    initialValues={{
                        email: '',
                        password: '',
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

                            <div className={submitCount ? (errors.password ? 'has-error' : '') : ''}>
                                <label htmlFor="Password">Mật khẩu</label>
                                <Field name="password" type="password" id="Password" placeholder="" className="form-input" />

                                {submitCount ? errors.password ? <div className="text-danger mt-1">{errors.password}</div> : '' : ''}
                            </div>
                            <div>
                                <Link to={AppRoutes.FORGOT_PASSWORD} className="cursor-pointer text-white-dark hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <button disabled={isLoading} className="btn btn-primary w-full">
                                ĐĂNG NHẬP
                            </button>
                            <div className="text-danger mt-1">{error && error?.message ? error?.message : ''}</div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SignInPage;
