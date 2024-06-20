import { Field, Form, Formik } from 'formik';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConfigAdmin, changeMultipleValue, changeValueByKey, getSystemDataByKey, updateShowStockKey, updateGetStockProv } from '../../../services/systemConfigService';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { GETSTOCKSTYPE, PAYPAL_KEY, SHOW_PAYPAL, SHOW_STOCK } from '../../../utils/const';
import { StockConfig } from '../../../types/system';

type Props = {};

export const ClientSetting = (props: Props) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showPaypal, setShowPaypal] = useState<`1` | `0`>(`1`);
    const [data, setData] = useState<any>({});
    const [inputInit, setInputInit] = useState<any>({});
    const [dataShowStock, setDataShowStock] = useState<any>({});

    const queryClient = useQueryClient();

    useQuery({
        queryKey: ['GETSTOCKSTYPE'],
        queryFn: () => getSystemDataByKey(GETSTOCKSTYPE),
        onSuccess: (data) => {
            const dataConfig: any = {};

            if (data.data.key)
                if (data.data.key === GETSTOCKSTYPE) {
                    dataConfig[data.data.key] = JSON.parse(data.data?.value as string);
                    setDataShowStock(dataConfig[data.data.key]);
                }
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const { data: systemConfig } = useQuery({
        queryKey: ['systemconfig'],
        queryFn: getConfigAdmin,
        onSuccess: (data) => {
            const dataConfig: any = {};
            let showPaypalVal = '';
            data?.data?.forEach((item: any) => {
                if (item.key != PAYPAL_KEY) {
                    dataConfig[item.key] = item;
                    inputInit[item.key] = item?.value;
                } else {
                    showPaypalVal = item.value as string;
                }
            });
            setData(dataConfig);
            setShowPaypal(showPaypalVal as `1` | `0`);
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const { mutate, isLoading: isLoadingUpdate } = useMutation({
        mutationFn: changeMultipleValue,
        onSuccess: (data) => {
            toast.success('Cập nhật thông tin thành công');
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const { mutate: mutationUpdateShowStock, isLoading: isLoadingUpdateShowStock } = useMutation({
        mutationFn: updateGetStockProv,
        onSuccess: (data) => {
            toast.success('Cập nhật thông tin thành công');
            queryClient.invalidateQueries(['show_stock_config']);
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const { mutate: mutationUpdateShowPaypal, isLoading: isLoadingUpdateShowPaypal } = useMutation({
        mutationFn: changeValueByKey,
        onSuccess: (data) => {
            toast.success('Cập nhật thông tin thành công');
            if (data?.data?.value) {
                setShowPaypal(data?.data?.value);
            }
        },
        onError: (error: any) => {
            toast.error(error?.message);
        },
    });

    const submitFormUpdate = async (data: any) => {
        const dataUpdate = [...systemConfig?.data?.data];
        dataUpdate.forEach((item: { id: string; key: string; value: string }) => {
            item.value = data[item.key];
            if (item.key == GETSTOCKSTYPE) {
                console.log('item.value ', item.value, data[item.key]);
            }
        });

        const dataSubmit = dataUpdate.filter((item) => item.key != GETSTOCKSTYPE);
        // console.log('data update ', dataUpdate);
        mutate(dataSubmit);
    };

    const submitFormStock = async (data: StockConfig) => {
        // console.log('data submit ', data);
        mutationUpdateShowStock(data);
    };

    return (
        <div className="panel">
            <div className="mb-5 w-full rounded-md">
                <Formik
                    className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                    initialValues={{
                        ...dataShowStock,
                    }}
                    // validationSchema={SubmittedForm}
                    onSubmit={submitFormStock}
                    enableReinitialize={true}
                >
                    {({ errors, submitCount, touched, setValues, isSubmitting, handleReset, values }) => (
                        <Form className="space-y-5">
                            <h6 className="text-lg font-bold mb-5">Stock</h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="pre">nor, pre</label>
                                    <Field name="pre" type="number" id="pre" className={`form-input`} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <button type="submit" className={`${false ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`} disabled={isLoadingUpdateShowStock}>
                                    {isLoadingUpdateShowStock ? (
                                        <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                    ) : (
                                        ''
                                    )}
                                    Lưu
                                </button>
                                <button type="button" onClick={handleReset} className={` btn btn-danger !mt-6`}>
                                    Reset
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                {/* <Formik
                    className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                    initialValues={{
                        ...dataShowStock,
                    }}
                    // validationSchema={SubmittedForm}
                    onSubmit={submitFormStock}
                    enableReinitialize={true}
                >
                    {({ errors, submitCount, touched, setValues, isSubmitting, handleReset, values }) => (
                        <Form className="space-y-5">
                            <h6 className="text-lg font-bold mb-5">Stock</h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="percent_normal">
                                        percent_normal <span className="text-rose-700">*</span>
                                    </label>
                                    <Field name="percent_normal" id="percent_normal" type="number" className={`form-input`} />
                                </div>
                                <div>
                                    <label htmlFor="percent_pre">percent_pre</label>
                                    <Field name="percent_pre" type="number" id="percent_pre" className={`form-input`} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="auto_nor">
                                        auto_normal <span className="text-rose-700">*</span>
                                    </label>
                                    <Field name="auto_nor" id="auto_nor" type="number" min={0} max={1} className={`form-input`} />
                                </div>
                                <div>
                                    <label htmlFor="auto_pre">auto_pre</label>
                                    <Field
                                        // disabled={!isEdit || isLoading}
                                        name="auto_pre"
                                        min={0}
                                        max={1}
                                        type="number"
                                        id="auto_pre"
                                        className={`form-input`}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-5 justify-center">
                                <button type="submit" className={`${false ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`} disabled={isLoadingUpdateShowStock}>
                                    {isLoadingUpdateShowStock ? (
                                        <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                    ) : (
                                        ''
                                    )}
                                    Luu
                                </button>
                                <button type="button" onClick={handleReset} className={` btn btn-danger !mt-6`}>
                                    Reset
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik> */}
            </div>
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    ...inputInit,
                }}
                // validationSchema={SubmittedForm}
                onSubmit={submitFormUpdate}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, isSubmitting, handleReset, values }) => (
                    <Form className="space-y-5">
                        <h6 className="text-lg font-bold mb-5">Tham số</h6>
                        <p className="italic"></p>
                        <div className="flex items-center gap-2">
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
                            <div className="ml-5 flex items-center gap-2">
                                <label className="w-12 h-6 relative">
                                    <input
                                        onChange={(e) => {
                                            mutationUpdateShowPaypal({
                                                id: PAYPAL_KEY,
                                                value: e.target.checked ? SHOW_PAYPAL.OPEN : SHOW_PAYPAL.CLOSE,
                                            });
                                        }}
                                        type="checkbox"
                                        checked={showPaypal == SHOW_PAYPAL.OPEN ? true : false}
                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                        id="custom_switch_checkbox1"
                                    />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                                <label className="text-lg ">
                                    Bật/tắt Paypal{' '}
                                    {isLoadingUpdateShowPaypal ? (
                                        <span className="ml-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                    ) : (
                                        ''
                                    )}
                                </label>
                            </div>
                        </div>

                        <PerfectScrollbar className="max-h-[500px] px-2">
                            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                                {data &&
                                    Object.keys(data)?.map((key: any) => (
                                        <div key={key}>
                                            <label htmlFor="host">{key.toUpperCase()}</label>
                                            {key != SHOW_STOCK ? (
                                                <Field
                                                    as={key === 'ul' || key === 'footer' || key === 'guide_box' ? 'textarea' : ''}
                                                    disabled={!isEdit || isLoadingUpdate}
                                                    name={key}
                                                    type="text"
                                                    id={key}
                                                    placeholder=" "
                                                    className={`form-input ${!isEdit || isLoadingUpdate ? 'bg-slate-100 text-slate-500 hover:cursor-auto' : ''}`}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </PerfectScrollbar>
                        <div className="flex flex-wrap gap-5 justify-center">
                            <button type="submit" className={`${!isEdit || isLoadingUpdate ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`} disabled={!isEdit || isLoadingUpdate}>
                                {isLoadingUpdate ? (
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

export default ClientSetting;
