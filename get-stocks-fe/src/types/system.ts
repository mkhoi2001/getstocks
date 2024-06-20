export type SystemProperty = {
    id: string;
    systemId: string;
    key: string;
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type System = {
    id: string;
    name: string;
    enable: boolean;
    host: string;
    email: string;
    username?: string | null;
    password: string;
    token?: string | null;
    balance: number;
    systemProperties?: SystemProperty[];
    createdAt?: Date;
    updatedAt?: Date;
};

export type StockConfig = {
    percent_normal: number;
    percent_pre: number;
    auto_nor: 1 | 0;
    auto_pre: 1 | 0;
};
