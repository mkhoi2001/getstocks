import { toast } from 'react-hot-toast';

export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
}

export const useToast = () => {
    const showToast = (type: ToastType = ToastType.SUCCESS, message: string = '') => {
        if (!type || !message) {
            return;
        }
        switch (type) {
            case ToastType.INFO:
                toast.success(message, {
                    style: {
                        border: '1px solid #2196f3',
                        color: '#333',
                    },
                    iconTheme: {
                        primary: '#2196f3',
                        secondary: '#FFFAEE',
                    },
                });
                break;
            case ToastType.SUCCESS:
                toast.success(message);
                break;
            case ToastType.ERROR:
                toast.error(message);
                break;
            default:
                toast(message);
        }
    };

    return { showToast };
};

export default useToast;
