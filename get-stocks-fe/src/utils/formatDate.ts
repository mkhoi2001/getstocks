export const formatDate = (date: any) => {
    if (date) {
        const dt = new Date(date);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();

        return day + '/' + month + '/' + dt.getFullYear();
    }
    return '';
};

export const formatDateTime = (date: any) => {
    if (date) {
        const dt = new Date(date);
        const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
        const hour = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
        const minute = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();

        return day + '/' + month + '/' + dt.getFullYear() + ' ' + hour + ':' + minute;
    }
    return '';
};
