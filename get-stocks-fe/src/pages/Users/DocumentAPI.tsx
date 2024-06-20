import { useMemo } from 'react';
import { DocumentAPICom } from '../../features/document';
import { ENV_CONFIG } from '../../utils/const';
import i18next from 'i18next';

type Props = {};

export type APIStructure = {
    key: string;
    url: string;
    name: string;
    desc: string;
    method: string;
    parameter: {
        key: string;
        name: string;
        type: string;
        position: string;
        required: string;
        desc: string;
    }[];
    response: {
        success: object;
        error: object;
    };
    note: string;
};

const DocumentAPI = (props: Props) => {
    const APIDocs: APIStructure[] = useMemo(
        () => [
            {
                key: '1',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/auth/apikey`,
                name: 'Get API Key',
                desc: i18next.language == 'vn' ? 'Lấy API Key' : 'descEn',
                method: 'POST',
                parameter: [
                    {
                        key: '1',
                        name: 'email',
                        type: 'string',
                        position: 'Body',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Email tài khoản đăng ký của bạn' : 'Your Register Email Account',
                    },
                    {
                        key: '1',
                        name: 'password',
                        type: 'string',
                        position: 'Body',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Mật khẩu của bạn' : 'Your Password',
                    },
                ],
                response: {
                    success: {
                        data: {
                            key: 'f0123123a40172ed3ae88a698ce0a8d47e51d337',
                        },
                        status: 200,
                        message: 'success',
                    },
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
            {
                key: '2',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/auth/profile?apikey=API-KEY`,
                name: 'Get Profile Info',
                desc: i18next.language == 'vn' ? 'Lấy thông tin tài khoản' : 'descEn',
                method: 'GET',
                parameter: [
                    {
                        key: '1',
                        name: 'apiKey',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Key của bạn' : 'Your Register Email Account',
                    },
                ],
                response: {
                    success: {
                        data: {
                            email: 'useremail@gmail.com',
                            username: 'username',
                            phone: null,
                            createdAt: '2023-07-12T17:46:25.945Z',
                            updatedAt: '2023-07-18T04:13:40.669Z',
                            firstName: null,
                            lastName: null,
                        },
                        status: 200,
                        message: 'success',
                    },
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
            {
                key: '3',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/orders/own?apikey=API-KEY`,
                name: 'Get Orders List',
                desc: i18next.language == 'vn' ? 'Lấy thông tin lịch sử nạp' : 'descEn',
                method: 'GET',
                parameter: [
                    {
                        key: '1',
                        name: 'apiKey',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Key của bạn' : 'Your Register Email Account',
                    },
                ],
                response: {
                    success: {
                        data: [
                            {
                                id: '21eb374c-5467-44af-a95c-cbe67df3d6ff',
                                content: '',
                                status: 'SUCCESS',
                                packageType: 'P',
                                reason: '',
                                cost: 4600,
                                costPayment: 3.45,
                                currency: 'usd',
                                createdAt: '2023-07-13T03:30:23.857Z',
                                updatedAt: '2023-07-13T03:30:23.857Z',
                            },
                        ],
                        status: 200,
                        message: 'success',
                    },
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
            {
                key: '4',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/balance?apikey=API-KEY`,
                name: 'Get Balance',
                desc: i18next.language == 'vn' ? 'Lấy số dư tài khoản' : 'descEn',
                method: 'GET',
                parameter: [
                    {
                        key: '1',
                        name: 'apiKey',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Key của bạn' : 'Your Register Email Account',
                    },
                ],
                response: {
                    success: {
                        data: {
                            email: 'useremail@gmail.com',
                            G: 119,
                            P: 123,
                            totalDeposit: 26000,
                        },
                        status: 200,
                        message: 'success',
                    },
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
            {
                key: '5',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/download/info?apikey=API-KEY`,
                name: 'Get Item Info',
                desc: i18next.language == 'vn' ? 'Lấy thông tin item' : 'descEn',
                method: 'POST',
                parameter: [
                    {
                        key: '1',
                        name: 'apiKey',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Key của bạn' : 'Your Register Email Account',
                    },
                    {
                        key: '2',
                        name: 'link',
                        type: 'string',
                        position: 'Body',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Link cần download' : 'Your Register Email Account',
                    },
                    {
                        key: '3',
                        name: 'type',
                        type: 'string',
                        position: 'Body',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Giá trị chỉ cho phép G hoặc P' : 'Your Register Email Account',
                    },
                ],
                response: {
                    success: {
                        data: {
                            itemSite: 'Freepik',
                            itemName: 'Free Photo | Landscape sand dune pattern at sunset outdoors generative ai',
                            itemTitle: 'Free Photo | Landscape sand dune pattern at sunset outdoors generative ai',
                            itemDesc: 'Download this Free Photo about Landscape sali...',
                            itemExt: 'zip',
                            itemThumb: 'https://img.freepik.com/free-photo/landscape-...',
                            itemLink: 'https://www.freepik.com/free-photo/landscape...',
                            itemOrigin: 'https://www.freepik.com',
                            itemSlug: 'landscape-sand-dune-pattern-sunset-outdoors-g...',
                            itemType: 'G',
                        },
                        status: 200,
                        message: 'success',
                    },
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
            {
                key: '6',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/download/getcode?apikey=API-KEY`,
                name: 'Get Item Download Code',
                desc: i18next.language == 'vn' ? 'Lấy code để download Item' : 'descEn',
                method: 'POST',
                parameter: [
                    {
                        key: '1',
                        name: 'apiKey',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Key của bạn' : 'Your Register Email Account',
                    },
                    {
                        key: '2',
                        name: 'link',
                        type: 'string',
                        position: 'Body',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Link cần download' : 'Your Register Email Account',
                    },
                    {
                        key: '3',
                        name: 'type',
                        type: 'string',
                        position: 'Body',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Giá trị chỉ cho phép G hoặc P' : 'Your Register Email Account',
                    },
                ],
                response: {
                    success: {
                        data: {
                            createdAt: '2023-07-18T07:07:09.897Z',
                            extension: 'jpg',
                            id: '3c4cffb2-af45-4e07-9641-5124aa99736a',
                            fileName: 'freepik_standard_40964074.jpg',
                            provider: 'Freepik',
                            itemDCode: 'f41105e2-1b4b-4633-a926-b06af5656e4b',
                            email: 'useremail@gmail.com',
                            link: 'https://www.freepik.com/free-p...4.htm',
                            type: 'G',
                            G: 117,
                            P: 123,
                        },
                        status: 200,
                        message: 'success',
                    },
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
            {
                key: '7',
                url: `${ENV_CONFIG.VITE_REACT_APP_API_URL_VERSION}/download/code?apikey=API-KEY&code=CODE`,
                name: 'API Download item',
                desc: i18next.language == 'vn' ? 'Link download file' : 'descEn',
                method: 'GET',
                parameter: [
                    {
                        key: '1',
                        name: 'apiKey',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Key của bạn' : 'Your Register Email Account',
                    },
                    {
                        key: '2',
                        name: 'code',
                        type: 'string',
                        position: 'Param',
                        required: 'Required',
                        desc: i18next.language == 'vn' ? 'Link cần download' : 'Your Register Email Account',
                    },
                ],
                response: {
                    success: {},
                    error: {
                        status: 'errorCode',
                        message: 'Message',
                    },
                },
                note: '',
            },
        ],

        [i18next.language]
    );
    return (
        <div>
            {APIDocs.map((item) => (
                <div key={item.key}>
                    <DocumentAPICom apidoc={item} />
                </div>
            ))}
        </div>
    );
};

export default DocumentAPI;
