export const generateParamsString = (params: any) => {
    return Object.keys(params)
        .filter((key) => params[key] !== null)
        .map((key) => `${key}=${params[key]}`)
        .join('&');
};
