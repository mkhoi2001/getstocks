import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppRoutes } from '../../router/routes';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { verifyForgotPassword, forgotPassword } from '../../services/authService';
import toast from 'react-hot-toast';

type Props = {};

const VerifyTokenRestPage = (props: Props) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [second, setSecond] = useState<number>(60);

    const email = searchParams.get('email') || '';
    useEffect(() => {
        if (searchParams) {
            if (!email) {
                navigate(AppRoutes.SIGN_IN);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecond((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const SubmittedForm = Yup.object().shape({
        token: Yup.string().required('Please fill the '),
    });

    const { mutate: forgotMutation, isLoading: isLoadingForgot }: { error: any; mutate: any; isLoading: boolean } = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data: any) => {
            setSecond(60);
            toast.success(data?.data?.message);
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const {
        error,
        mutate: verifyForgotMutation,
        isLoading,
    }: { error: any; mutate: any; isLoading: boolean } = useMutation({
        mutationFn: verifyForgotPassword,
        onSuccess: (data: any) => {
            navigate(`${AppRoutes.PASSWORD_RESET}?email=${email}`);
        },
    });

    const reCall = async () => {
        if (isLoadingForgot || second) return;
        forgotMutation({ email });
    };

    const submitForm = (data: { token: string }) => {
        verifyForgotMutation({ email, token: data.token });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/assets/images/map.svg')] dark:bg-[url('/assets/images/map-dark.svg')]">
            <div className="panel sm:w-[480px] m-6 max-w-lg w-full">
                <h2 className="font-bold text-2xl mb-3">Nhập mã xác nhận</h2>
                <p className="mb-7">Nhập mã xác nhận từ email</p>
                <Formik
                    className="space-y-5"
                    initialValues={{
                        token: '',
                    }}
                    validationSchema={SubmittedForm}
                    onSubmit={submitForm}
                >
                    {({ errors, submitCount, touched }) => (
                        <Form className="space-y-5">
                            <div className={submitCount ? (errors.token ? 'has-error' : '') : ''}>
                                <label htmlFor="token">Nhập mã</label>
                                <Field name="token" type="text" id="token" placeholder="" className="form-input" />

                                {submitCount ? errors.token ? <div className="text-danger mt-1">{errors.token}</div> : '' : ''}
                            </div>

                            <button type="submit" disabled={isLoading} className={`${isLoading ? 'opacity-20' : 'opacity-100'} btn btn-primary w-full`}>
                                {isLoading ? (
                                    <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                ) : (
                                    ''
                                )}
                                <span className="text-upper">Tiếp tục</span>
                            </button>
                            <div className="text-danger mt-1">{error && error?.message ? error?.message : ''}</div>
                        </Form>
                    )}
                </Formik>
                <div>
                    <span>Không nhận được email?</span>{' '}
                    <span onClick={reCall} className={`${second ? 'opacity-20' : 'opacity-100'} hover:cursor-pointer ml-2 inline-block btn btn-info w-fit`}>
                        {second > 0 ? second : ''}
                        {isLoadingForgot ? (
                            <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                        ) : (
                            ''
                        )}{' '}
                        Gửi lại
                    </span>
                </div>
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

export default VerifyTokenRestPage;
