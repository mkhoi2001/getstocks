export type Order = {
    id: number;
    oID: string;
    email: string;
    oName: string;
    oTransID: string;
    oPayerAccount: string;
    oPayeeAccount: string;
    oPayProvider: string;
    oPackageID: number;
    oTotalCost: string;
    oFees: string;
    oVerified: number;
    oComments: string;
    status: string;
    oCurrency: string;
    oTimes: number;
    updated_at: Date;
    created_at: Date;
};
