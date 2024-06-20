import { Tab } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Fragment, useEffect, useState } from 'react';
import { PanelDownload } from '../PanelDownload';

type Props = {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
};

export const TabDownload = ({ setSelectedIndex, selectedIndex }: Props) => {
    const { t } = useTranslation();

    return (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''}
                dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                        >
                            {t('download_g')}
                        </button>
                    )}
                </Tab>
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black ' : ''}
                dark:hover:border-b-black' -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                        >
                            {t('download_p')}
                        </button>
                    )}
                </Tab>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel>
                    <div className="pt-5 p-2">
                        <PanelDownload type={'G'} />
                        {/* <FormDown
                    link={linkG}
                    setLink={setLinkG}
                    mutation={downloadItemGMutation}
                    setIsDownloading={setIsDownloading}
                    isSuccess={isSuccessDownG}
                    isLoading={isLoadingDownG}
                    isDownloading={isDownloading}
                    SubmittedForm={SubmittedForm}
                    selectedIndex={selectedIndex}
                    enableDownload={enableDownloadG}
                    setEnableDownload={setEnableDownloadG}
                    clickDownload={clickDownload}
                />
                <div className="flex flex-wrap gap-5 justify-center">
                    {enableDownloadG && !isLoadingDownG ? (
                        <>
                            <a href={enableDownloadG && dataDownload ? downloadUrl : '#'} className={` btn btn-success !mt-6`}>
                                {t('btn_download_item')}
                            </a>
                        </>
                    ) : (
                        ''
                    )}
                    {errorG && !enableDownloadG ? <p className="text-red-500 text-bold italic">{errorG}</p> : ''}
                </div> */}

                        {/* <div className="mt-4">
                    <ItemList isLoading={isLoadingG} items={stockGData?.data?.content} />
                </div> */}
                    </div>
                </Tab.Panel>
                <Tab.Panel>
                    <div className="pt-5 p-2">
                        <PanelDownload type={'P'} />

                        {/* <FormDown
                    link={linkP}
                    setLink={setLinkP}
                    mutation={downloadItemPMutation}
                    setIsDownloading={setIsDownloading}
                    isSuccess={isSuccessDownP}
                    isDownloading={isDownloading}
                    isLoading={isLoadingDownP}
                    SubmittedForm={SubmittedForm}
                    selectedIndex={selectedIndex}
                    enableDownload={enableDownloadP}
                    clickDownload={clickDownload}
                    setEnableDownload={setEnableDownloadP}
                />
                <div className="flex flex-wrap gap-5 justify-center">
                    {enableDownloadP && !isLoadingDownP ? (
                        <>
                            <a href={enableDownloadP && dataDownload ? downloadUrl : '#'} className={` btn btn-success !mt-6`}>
                                {t('btn_download_item')}
                            </a>
                        </>
                    ) : (
                        ''
                    )}
                    {errorP && !enableDownloadP ? <p className="text-red-500 text-bold italic">{errorP}</p> : ''}
                </div> */}
                    </div>
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
};

export default TabDownload;
