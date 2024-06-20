export type Provider = {
    id?: number;
    provName: string;
    provSlug: string;
    isSupport: boolean;
    provHost: string;
    provType: string;
    provLogo: string;
    provResolution: string;
    provLicense: string;
    provPrice: string;
    provPriceBonus: string;
    provSaveTo: string;
    isPremium: number;
    isAPIAccess: number;
    status: number;
    updated_at: Date;
    created_at: Date;
};
