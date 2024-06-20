import React from 'react';
import { GetStockItem, PackageType } from '../../../../types/stock';
import { Form, Formik } from 'formik';
import Select from 'react-select';

type Props = {
    isSuccess?: boolean;
    isNew?: boolean;
    mutation: any;
    isLoading?: boolean;
    stock: GetStockItem;
};

const options = [
    {
        value: 'G',
        label: '$',
    },
    {
        value: 'P',
        label: 'P',
    },
    {
        value: 'BOTH',
        label: 'Cả hai',
    },
];

const ProviderForm = ({ mutation, isSuccess, isLoading, stock }: Props) => {
    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    const submitFormUpdate = (data: any) => {
        mutation({ id: stock.id, typePack: data?.typePack });
    };
    return (
        <div>
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    typePack: stock?.typePack as string,
                }}
                onSubmit={submitFormUpdate}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, isSubmitting, handleReset, values }) => (
                    <Form className="space-y-5">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={''}>
                                <label htmlFor="systemId">
                                    Gói <span className="text-rose-700">*</span>
                                </label>
                                <Select
                                    className="dark:bg-[#1b2e4b]"
                                    name="systemId"
                                    value={options.find((item) => item.value === values.typePack)}
                                    onChange={(option) => setValues({ ...values, typePack: option?.value ? option?.value : values.typePack })}
                                    isDisabled={!isEdit || isLoading}
                                    placeholder="Select an option"
                                    options={options}
                                />

                                {submitCount && isEdit ? errors.typePack ? <div className="text-danger mt-1">{errors.typePack}</div> : '' : ''}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-5 justify-center">
                            <button type="submit" className={`${!isEdit || isLoading ? 'opacity-20' : 'opacity-100'} btn btn-primary !mt-6`} disabled={!isEdit || isLoading}>
                                {isLoading ? (
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

export default ProviderForm;
