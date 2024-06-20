import ReactJson from 'react-json-view';
import { APIStructure } from '../../../pages/Users/DocumentAPI';
import i18next from 'i18next';

type Props = {
    apidoc: APIStructure;
};

const apiSame = {
    url: 'https://getstocks.net/api/auth/login',
    key: 1,
    name: 'GET ACCESSTOKEN',
    description: 'Accesstoken is the method to authenticate your api information. Required for other steps.',
    method: 'POST',
    parameter: [
        {
            key: '1',
            name: 'email',
            type: 'string',
            position: 'body',
            required: 'required',
            desc: 'Your registered email address',
        },
        {
            key: '21',
            name: 'password',
            type: 'string',
            position: 'body',
            required: 'required',
            desc: 'Your password',
        },
    ],
    response: {
        success: {},
        error: {},
    },
    note: 'Note: This token is not expired by default. No need to generate each time you try to call api.',
};

export const DocumentAPICom = ({ apidoc }: Props) => {
    return (
        <div className="panel">
            <div className="grid grid-cols-1 sm:grid-cols-5">
                <div className="col-span-3 sm:col-span-3 p-2">
                    <p className="text-black dark:text-white-dark text-lg mb-2"># {apidoc.name}</p>
                    <p className="text-black dark:text-white-dark text-sm">{apidoc.desc}</p>
                    <p className="text-md">
                        <span className="font-bold text-black dark:text-white-dark">{apidoc.method}</span> <span className="italic bg-gray-200"> {`  ${apidoc.url}  `} </span>
                    </p>
                    <div className="table-responsive my-5">
                        <table>
                            <thead>
                                <tr>
                                    <th>Parameter</th>
                                    <th>Type</th>
                                    <th>Position</th>
                                    <th>Required</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apidoc.parameter.map((item) => (
                                    <tr key={item.key}>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>{item.position}</td>
                                        <td>{item.required}</td>
                                        <td>{item.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-red-600 italic text-sm">Note: {apidoc.note}</p>
                </div>
                <div className="col-span-3 sm:col-span-2">
                    <p className="text-black dark:text-white-dark text-lg"># Response</p>
                    <ResponseAPI type="Success" data={apidoc.response.success} />
                    <ResponseAPI type="Error" data={apidoc.response.error} />
                </div>
            </div>
        </div>
    );
};

export default DocumentAPICom;

export const ResponseAPI = ({ type, data }: { type: string; data: object }) => {
    return (
        <div>
            <p className="text-black dark:text-black text-white-dark text-lg">{type}</p>
            <div className="text-black dark:text-white-dark bg-gray-100 font-['Consolas'] p-1">
                <ReactJson src={data} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    );
};
