export type Bank = {
    id: string;
    bankName: string;
    cardNumber: string;
    username: string;
    host?: string;
    bankcode?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};
