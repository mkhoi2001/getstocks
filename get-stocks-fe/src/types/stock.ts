import { System } from './system';

export enum PackageType {
    G = 'G',
    P = 'P',
}

export type Stock = {
    id?: string;
    name: string;
    host: string;
    pathName?: string;
    systemId: string;
    system?: System;
    isActive: boolean;
    stockTypes?: StockTypes[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type StockTypes = {
    id: string;
    type: PackageType;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type GetStockItem = {
    id: string;
    name: string;
    host: string;
    price: number;
    status: boolean;
    type: string;
    typePack: 'G' | 'P' | 'BOTH';
    props: string;
    isPre: boolean;
    createdAt: Date;
    updatedAt: Date;
};
