import { ItemHistory } from './item';
import { PackageOrder } from './package';

export enum ROLES {
    // USER = '@UXVF',
    // ADMIN = '!@XDGBER',
    USER = '12dea96',
    ADMIN = 'd033e22a',
    // USER = 'USER',
    // ADMIN = 'ADMIN',
}

export type User = {
    id?: string;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: ROLES;
    phone: string;
    isActive: boolean;
    balanceG: number;
    balanceP: number;
    totalDeposit: number;
    packageOrder: PackageOrder;
    ItemHistory: ItemHistory[];
    lastLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export type DataAmount = {
    type: 'P' | 'G';
    amount: number;
};
