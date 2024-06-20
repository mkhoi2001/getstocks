import { Field, Form, Formik } from 'formik';
import { PackageType } from '../../../types/stock';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    SubmittedForm: any;
    mutation: any;
    isSuccess: boolean;
    isLoading: boolean;
    setIsDownloading: Dispatch<SetStateAction<boolean>>;
    link?: string;
    setLink: Dispatch<SetStateAction<string>>;
    selectedIndex?: number;
    enableDownload: boolean;
    clickDownload?: any;
    isDownloading: boolean;
    type: 'G' | 'P';
    setEnableDownload: Dispatch<SetStateAction<boolean>>;
};

export const FormDown = ({ setEnableDownload, type, enableDownload, selectedIndex, setLink, link, SubmittedForm, mutation, isSuccess, isLoading, setIsDownloading }: Props) => {
    const submitForm = (data: any) => {
        setIsDownloading(true);
        setLink(data.url);
        mutation({ link: data.url, type: type });
    };
    const { t } = useTranslation();

    return (
        <div className="">
            <Formik
                className=" border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black"
                initialValues={{
                    url: link || '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={submitForm}
                enableReinitialize={true}
            >
                {({ errors, submitCount, touched, setValues, values, handleChange }) => (
                    <Form>
                        <div className="grid grid-cols-1 ">
                            <div className="flex gap-2">
                                <div className={`flex-1 ${!isSuccess && submitCount ? (errors.url ? 'has-error' : 'has-success') : ''}`}>
                                    <Field
                                        disabled={isLoading}
                                        onChange={(e: React.ChangeEvent<any>) => {
                                            if (enableDownload) {
                                                setEnableDownload(false);
                                            }
                                            // setLink(values.url);
                                            setLink(e.target.value);
                                            return setValues({ url: e.target.value });
                                        }}
                                        name="url"
                                        type="text"
                                        id="url"
                                        placeholder="https://...."
                                        className={`form-input `}
                                    />
                                    {/* {submitCount && errors.url ? <div className="text-danger mt-1">{errors.url}</div> : ''} */}
                                </div>
                                <button
                                    type="submit"
                                    className={`${isLoading ? 'opacity-20' : 'opacity-100'}  btn btn-info bg-gradient-to-r from-blue-500 to-blue-400`}
                                    disabled={isLoading || !values.url.length}
                                >
                                    {isLoading ? (
                                        <span className="mr-2 animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                    ) : (
                                        ''
                                    )}
                                    {/* {t('checking')} */}
                                    {t('btn_download_item')}
                                </button>
                            </div>
                            {submitCount && errors.url ? <div className="text-danger mt-1">{errors.url}</div> : ''}
                        </div>
                        {/* <div className="flex flex-wrap gap-5 justify-center">
                            {enableDownload && !isLoading ? (
                                <button type="button" onClick={clickDownload} className={` btn btn-success !mt-6`} disabled={!enableDownload}>
                                    {t('btn_download_item')}
                                </button>
                            ) : (
                                ''
                            )}
                        </div> */}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormDown;
