import { User } from './user';

export type PackagePricingG = {
    id: string;
    name: string;
    balanceG: number;
    balanceP: number;
    content: string;
    price: number;
    guideEn?: string;
    guideVn?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PackagePricingP = {
    id: string;
    name: string;
    dayExpires: number;
    downPerDay: number;
    content: string;
    guideEn?: string;
    guideVn?: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
};

export type PackageOrder = {
    id: string;
    userId: string;
    user?: User;
    expireTime: Date;
    isExpired: boolean;
    dailyLeft: number;
    downDaily: number;
    createdAt: Date;
    updatedAt: Date;
};
