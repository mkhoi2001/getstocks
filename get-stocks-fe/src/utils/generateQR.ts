import axios from 'axios';

export type QRData = {
    bank_id: string;
    account_no: string;
    template: string;
    amount: string;
    description: string;
    account_name: string;
};

export const generateQr = async (data: QRData) => {
    const url = `https://img.vietqr.io/image/${data.bank_id}-${data.account_no}-${data.template}.png?amount=${data.amount}&addInfo=${data.description}&accountName=${data.account_name}`;
    return await axios.get(url);
};

export const generateUrlQr = async (data: QRData) => {
    //const url = `https://img.vietqr.io/image/${data.bank_id}-${data.account_no}-${data.template}.png?amount=${data.amount}&addInfo=${data.description}&accountName=${data.account_name}`;
    const url = `https://qrcode.io.vn/api/generate/${data.bank_id}/${data.account_no}/${data.amount}/${data.description}?frame=1&is_mask=0`;
    return url;
};

export const generateMomoQR = async (data: { content: string; phone: string; amount: string }) => {
    // Convert all whitespaces to %20 -> Url format
    const contentFormat = data.content.replace(/\s/g, '%20');
    
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2|99|${data.phone}|||0|0|${data.amount}|${contentFormat}|transfer_p2p`;

    return url;
};
