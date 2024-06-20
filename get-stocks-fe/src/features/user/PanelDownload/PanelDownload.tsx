import { FormDown } from '../../item';
import { useEffect, useState } from 'react';
import { downloadItemTypeG, downloadItemTypeP } from '../../../services/itemService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ENV_CONFIG } from '../../../utils/const';
import { PackageType } from '../../../types/stock';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../../store/userSlice';

type Props = {
    type: 'G' | 'P';
};

export const PanelDownload = ({ type }: Props) => {
    const dispatch = useDispatch();
    const [link, setLink] = useState<string>('');
    const [enableDownload, setEnableDownload] = useState<boolean>(false);
    const [dataDownload, setDataDownload] = useState<any>('');
    const [error, setError] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const { t } = useTranslation();
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    // moi lan click la tru tien khach
    const [hideCheckBtn, setHideCheckBtn] = useState<boolean>();
    // const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!link) {
            setError('');
        }
    }, [link]);

    const {
        mutate: downloadItemPMutation,
        isSuccess: isSuccessDownP,
        isLoading: isLoadingDownP,
    } = useMutation({
        mutationFn: downloadItemTypeP,
        onSuccess: (data) => {
            // console.log('data ', data);
            setEnableDownload(true);
            setDataDownload(data?.data?.item);
            handleReadyDownload(data?.data?.item);
            dispatch(updateUserInfo(data?.data?.user));
            setError('');
        },
        onError: (error: any) => {
            toast.error(error?.message);
            setIsDownloading(false);
            setError(error?.message);
        },
    });

    const {
        mutate: downloadItemGMutation,
        isSuccess: isSuccessDownG,
        isLoading: isLoadingDownG,
    } = useMutation({
        mutationFn: downloadItemTypeG,
        onSuccess: (data: any) => {
            // console.log('data ', data);
            setEnableDownload(true);
            setDataDownload(data?.data?.item);
            handleReadyDownload(data?.data?.item);
            dispatch(updateUserInfo(data?.data?.user));

            // const baseAPI = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;
            // const downloadUrl = `${baseAPI}/item/down?code=${data?.data?.itemDCode}`;
            // setDownUrl(downloadUrl);
            setError('');
        },
        onError: (error: any) => {
            toast.error(error?.message);
            setError(error?.message);
            setIsDownloading(false);
        },
    });

    const SubmittedForm = Yup.object().shape({
        url: Yup.string()
            .required(t('required_url'))
            .max(400, t('max_400_char'))
            .matches(
                /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
                t('invalid_url')
            ),
    });

    const handleReadyDownload = (data: any) => {
        const baseAPI = ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION;
        const downloadUrl = `${baseAPI}/item/down?code=${data?.itemDCode}`;
        setDownloadUrl(downloadUrl);
        toast.success(t('down_item_success'));
        setIsDownloading(false);
    };

    useEffect(() => {
        if (enableDownload) {
            const aTag = document.querySelector<HTMLAnchorElement>('#btn_download_item');
            if (aTag) {
                aTag.click();
            }
        }
    }, [enableDownload]);

    return (
        <>
            <FormDown
                link={link}
                setLink={setLink}
                mutation={type === PackageType.G ? downloadItemGMutation : downloadItemPMutation}
                setIsDownloading={setIsDownloading}
                isSuccess={type === PackageType.G ? isSuccessDownG : isSuccessDownP}
                isLoading={type === PackageType.G ? isLoadingDownG : isLoadingDownP}
                isDownloading={isDownloading}
                SubmittedForm={SubmittedForm}
                // selectedIndex={selectedIndex}
                type={type}
                enableDownload={enableDownload}
                setEnableDownload={setEnableDownload}
            />
            <div className="flex flex-wrap gap-5 justify-center">
                {enableDownload && (!isLoadingDownG || !isLoadingDownP) ? (
                    <>
                        <a id={'btn_download_item'} style={{ display: 'none' }} href={enableDownload && dataDownload ? downloadUrl : '#'} className={` btn btn-success !mt-6`}>
                            {t('btn_download_item')}
                        </a>
                    </>
                ) : (
                    ''
                )}
                {error && !enableDownload ? <p className="text-red-500 text-bold italic">{error}</p> : ''}
            </div>
        </>
    );
};

export default PanelDownload;
