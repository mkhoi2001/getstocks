import { System } from './system';
import { User } from './user';

export type ItemHistory = {
    id: string;
    userId: string;
    user?: User;
    systemId: string;
    system?: System;
    itemDCode: string;
    provider: string;
    link: string;
    provSlug?: string;
    itemID?: string;
    cost: number;
    itemType?: string;
    isPremium?: number;
    fileName: string;
    extension: string;
    expireTime: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
