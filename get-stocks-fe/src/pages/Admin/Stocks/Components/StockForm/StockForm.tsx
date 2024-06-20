import { useState } from 'react';

import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PackageType, Stock } from '../../../../../types/stock';
import { formatDateTime } from '../../../../../utils/formatDate';
import Select from 'react-select';
import { getAllSystems } from '../../../../../services/systemService';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { System } from '../../../../../types/system';
import { useTranslation } from 'react-i18next';
import { GuideBox } from '../../../../../components';

type Props = {
    stock?: Stock;
    isSuccess?: boolean;
    isNew?: boolean;
    mutation?: any;
    isLoading?: boolean;
};

type HostSelect = {
    value: string;
    label: string;
};

export const StockForm = ({ isLoading, stock, isSuccess, isNew, mutation }: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(isNew || false);
    const [options, setOptions] = useState<HostSelect[]>([]);
    const { t } = useTranslation();

    useQuery({
        queryKey: ['systems'],
        queryFn: getAllSystems,
        onSuccess: (data) => {
            const dataOptions: HostSelect[] = [];
            data?.data?.content.forEach((item: System) => {
                dataOptions.push({
                    value: item.id,
                    label: `${item.name}: (${item.host})`,
                });
            });
            setOptions(dataOptions);
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required(t('name_required')).max(50, t('name_max_50')),
        host: Yup.string().required(t('host_required')),
        systemId: Yup.string().required(t('system_required')),
        priceG: Yup.number().typeError(t('int_required')).notRequired().min(0, t('value_gt_0')),
        priceP: Yup.number().typeError(t('int_required')).notRequired().min(0, t('value_gt_0')),
    });

    const submitFormCreate = (data: any) => {
        // console.log('data submit', data);
        data.stockTypes = [];
        if (data.priceG) {
            data.stockTypes.push({ type: PackageType.G, price: +data.priceG });
        }

        if (data.priceP) {
            data.stockTypes.push({ type: PackageType.P, price: +data.priceP });
        }
        const dataInput = { ...data };

        delete dataInput.priceP;
        delete dataInput.priceG;
        mutation(dataInput);
    };

    const submitFormUpdate = (data: any) => {
        data.id = stock?.id;

        mutation(data);
    };

    return (
        <div>
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    name: stock?.name || '',
                    host: stock?.host || '',
                    pathName: stock?.pathName || '',
                    systemId: stock?.systemId || '',
                    priceG: stock?.stockTypes?.find((stockType) => stockType.type === PackageType.G)?.price || 0,
                    priceP: stock?.stockTypes?.find((stockType) => stockType.type === PackageType.P)?.price || 0,
                }}
                validationSchema={SubmittedForm}
                onSubmit={isNew ? submitFormCreate : submitFormUpdate}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, isSubmitting, handleReset, values }) => (
                    <Form className="space-y-5">
                        <h6 className="text-lg font-bold mb-5">{t('stock_info')}</h6>
                        <p className="italic">
                            <span className="text-rose-700">*</span> {t('required')}
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
                                <label className="text-lg ">{t('edit')}</label>
                            </div>
                        )}

                        {isNew ? (
                            ''
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="ID">ID</label>
                                    <Field disabled name="id" value={stock?.id || ''} type="text" id="ID" placeholder="ID" className="bg-slate-100 text-slate-500 form-input hover:cursor-auto" />
                                </div>
                                <div>
                                    <label htmlFor="isActive">{t('status')}</label>
                                    <Field
                                        disabled
                                        name="isActive"
                                        value={stock?.isActive ? t('status_active') : t('status_lock')}
                                        type="text"
                                        placeholder="Trạng thái"
                                        className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                    />
                                </div>
                            </div>
                        )}

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
                            <div className={!isSuccess && submitCount && isEdit ? (errors.systemId ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="systemId">
                                    {t('system')} <span className="text-rose-700">*</span>
                                </label>
                                <Select
                                    className="dark:bg-[#1b2e4b]"
                                    name="systemId"
                                    value={options.find((item) => item.value === values.systemId)}
                                    onChange={(option) => setValues({ ...values, systemId: option?.value ? option?.value : values.systemId })}
                                    isDisabled={!isEdit || isLoading}
                                    placeholder="Select an option"
                                    options={options}
                                />

                                {submitCount && isEdit ? errors.systemId ? <div className="text-danger mt-1">{errors.systemId}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={!isSuccess && submitCount && isEdit ? (errors.host ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="host">
                                    Nguồn <span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="host"
                                    type="text"
                                    id="host"
                                    placeholder="Nguồn: "
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />

                                {submitCount && isEdit ? errors.host ? <div className="text-danger mt-1">{errors.host}</div> : '' : ''}
                            </div>
                            <div className={!isSuccess && submitCount && isEdit ? (errors.pathName ? 'has-error' : 'has-success') : ''}>
                                <label htmlFor="pathName">
                                    Đường dẫn con<span className="text-rose-700">*</span>
                                </label>
                                <Field
                                    disabled={!isEdit || isLoading}
                                    name="pathName"
                                    type="text"
                                    id="pathName"
                                    placeholder="Đường dẫn con:"
                                    className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                />
                                {submitCount && isEdit ? errors.pathName ? <div className="text-danger mt-1">{errors.pathName}</div> : '' : ''}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <label htmlFor="priceG">Giá G</label>
                                    <div className={!isSuccess && submitCount && isEdit ? (errors.priceP ? 'has-error' : 'has-success') : ''}>
                                        <Field
                                            disabled={!isEdit || isLoading}
                                            id="priceG"
                                            name="priceG"
                                            type="number"
                                            placeholder="Giá G"
                                            className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount && isEdit ? errors.priceG ? <div className="text-danger mt-1">{errors.priceG}</div> : '' : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <label htmlFor="priceP">Giá P</label>
                                    <div className={!isSuccess && submitCount && isEdit ? (errors.priceP ? 'has-error' : 'has-success') : ''}>
                                        <Field
                                            name="priceP"
                                            type="number"
                                            placeholder="Giá P"
                                            disabled={!isEdit || isLoading}
                                            id="priceP"
                                            className={`form-input ${!isEdit || isLoading ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                        />
                                        {submitCount && isEdit ? errors.priceP ? <div className="text-danger mt-1">{errors.priceP}</div> : '' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isNew ? (
                            ''
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="createdAt">{t('created_at')}</label>
                                    <Field
                                        disabled
                                        name="createdAt"
                                        value={stock?.createdAt ? formatDateTime(stock?.createdAt) : ''}
                                        type="text"
                                        id="ID"
                                        placeholder=""
                                        className="bg-slate-100 text-slate-500 form-input hover:cursor-auto"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="updatedDate">{t('updated_at')}</label>
                                    <Field
                                        disabled
                                        value={stock?.updatedAt ? formatDateTime(stock?.updatedAt) : ''}
                                        name="updatedDate"
                                        type="text"
                                        id="updatedDate"
                                        placeholder=""
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
                                {t('save')}
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

export default StockForm;
