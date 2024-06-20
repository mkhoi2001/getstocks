import { PackagePricingG, PackagePricingP } from './package';
import { PackageType } from './stock';
import { User } from './user';

export enum OrderStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
}

export type Order = {
    id?: string;
    userId: string;
    user?: User;
    packageType: PackageType;
    packagePricingGId?: string;
    packagePricingPId?: string;
    packagePricingG?: PackagePricingG;
    packagePricingP?: PackagePricingP;
    content: string;
    status?: OrderStatus;
    provider: string;
    cardNumber?: string;
    phone: string;
    reason?: string;
    cost: number;
    costPayment: number;
    currency: string;
    createdAt?: Date;
    updatedAt?: Date;
};
