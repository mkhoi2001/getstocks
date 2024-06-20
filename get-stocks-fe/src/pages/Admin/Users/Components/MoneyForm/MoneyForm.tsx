import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { User, DataAmount } from '../../../../../types/user';
import { ToastType, useToast } from '../../../../../hooks';
import { useTranslation } from 'react-i18next';

type Props = {
    plusMutation: any;
    minusMutation: any;
    user?: User;
    isLoadingPlus: boolean;
    isLoadingMinus: boolean;
    isSuccessPlus: boolean;
    isSuccessMinus: boolean;
};

export const MoneyForm = ({ user, isLoadingPlus, plusMutation, isSuccessPlus, minusMutation, isLoadingMinus, isSuccessMinus }: Props) => {
    const { showToast } = useToast();
    const { t } = useTranslation();

    const SubmittedForm = Yup.object().shape({
        balanceP: Yup.number().typeError(t('int_required')).notRequired().min(0, t('value_gt_0')),
        balanceG: Yup.number().typeError(t('int_required')).notRequired().min(0, t('value_gt_0')),
    });

    const submitFormPlus = async (data: { balanceG: number; balanceP: number }, { resetForm }: FormikHelpers<{ balanceG: number; balanceP: number }>) => {
        // console.log('data ', data);
        const dataAmount: DataAmount[] = [];
        if (data.balanceG) {
            dataAmount.push({ type: 'G', amount: +data.balanceG });
        }
        if (data.balanceP) {
            dataAmount.push({ type: 'P', amount: +data.balanceP });
        }
        if (!dataAmount.length) {
            showToast(ToastType.INFO, t('nothing_changed'));
            return;
        }

        plusMutation({ id: user?.id, data: dataAmount });
        resetForm();
    };

    const submitFormMinus = async (data: { balanceG: number; balanceP: number }, { resetForm }: FormikHelpers<{ balanceG: number; balanceP: number }>) => {
        const dataAmount: DataAmount[] = [];
        if (data.balanceG) {
            dataAmount.push({ type: 'G', amount: +data.balanceG });
        }
        if (data.balanceP) {
            dataAmount.push({ type: 'P', amount: +data.balanceP });
        }
        if (!dataAmount.length) {
            showToast(ToastType.INFO, t('nothing_changed'));

            return;
        }
        minusMutation({ id: user?.id, data: dataAmount });
        resetForm();
    };

    return (
        <div>
            <div className="m-5">
                <p>
                    UserID: <span className="italic font-bold"> {user?.id}</span>
                </p>
                <p>
                    <span>{t('balance_g_')}</span> <span className="font-bold">{user?.balanceG}</span>
                </p>
                <p>
                    <span>{t('balance_p_')}</span> <span className="font-bold">{user?.balanceP}</span>
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="panel">
                    <Formik
                        className=" shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none p-5"
                        initialValues={{
                            balanceP: 0,
                            balanceG: 0,
                        }}
                        validationSchema={SubmittedForm}
                        onSubmit={submitFormPlus}
                        enableReinitialize={true}
                    >
                        {({ errors, submitCount, touched, setValues, handleSubmit, handleReset, isSubmitting }) => (
                            <Form className="space-y-5">
                                <h6 className="text-lg font-bold mb-5">{t('charge')}</h6>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className={!isSuccessPlus && submitCount ? (errors.balanceG ? 'has-error' : 'has-success') : ''}>
                                        <label htmlFor="balanceG">{t('balance_g')}</label>
                                        <Field
                                            disabled={isSubmitting}
                                            name="balanceG"
                                            type="number"
                                            id="balanceG"
                                            placeholder=""
                                            // min="0"
                                            className={`form-input ${isSubmitting ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount ? errors.balanceG ? <div className="text-danger mt-1">{errors.balanceG}</div> : '' : ''}
                                    </div>

                                    <div className={!isSuccessPlus && submitCount ? (errors.balanceP ? 'has-error' : 'has-success') : ''}>
                                        <label htmlFor="balanceP">{t('balance_p')}</label>
                                        <Field
                                            disabled={isSubmitting}
                                            name="balanceP"
                                            type="number"
                                            id="balanceP"
                                            placeholder=""
                                            // min="0"
                                            className={`form-input ${isSubmitting ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount ? errors.balanceP ? <div className="text-danger mt-1">{errors.balanceP}</div> : '' : ''}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-5 justify-center">
                                    <button type="submit" className={`${isSubmitting ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`}>
                                        {isSubmitting ? (
                                            <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                        ) : (
                                            ''
                                        )}
                                        {t('confirm')}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="panel">
                    <Formik
                        className=" shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-[#e0e6ed] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none p-5"
                        initialValues={{
                            balanceP: 0,
                            balanceG: 0,
                        }}
                        validationSchema={SubmittedForm}
                        onSubmit={submitFormMinus}
                        enableReinitialize={true}
                    >
                        {({ errors, submitCount, touched, setValues, handleSubmit, handleReset, isSubmitting }) => (
                            <Form className="space-y-5">
                                <h6 className="text-lg font-bold mb-5">{t('minus_balance')}</h6>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className={!isSuccessPlus && submitCount ? (errors.balanceG ? 'has-error' : 'has-success') : ''}>
                                        <label htmlFor="balanceG">{t('balance_g')}</label>
                                        <Field
                                            disabled={isSubmitting}
                                            name="balanceG"
                                            type="number"
                                            id="balanceG"
                                            placeholder=""
                                            className={`form-input ${isSubmitting ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount ? errors.balanceG ? <div className="text-danger mt-1">{errors.balanceG}</div> : '' : ''}
                                    </div>

                                    <div className={!isSuccessPlus && submitCount ? (errors.balanceP ? 'has-error' : 'has-success') : ''}>
                                        <label htmlFor="balanceP">{t('balance_p')}</label>
                                        <Field
                                            disabled={isSubmitting}
                                            name="balanceP"
                                            type="number"
                                            id="balanceP"
                                            placeholder=""
                                            className={`form-input ${isSubmitting ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount ? errors.balanceP ? <div className="text-danger mt-1">{errors.balanceP}</div> : '' : ''}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-5 justify-center">
                                    <button type="submit" className={`${isSubmitting ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`}>
                                        {isSubmitting ? (
                                            <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                        ) : (
                                            ''
                                        )}
                                        {t('confirm')}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default MoneyForm;
