export interface CommonGearItem {
    _id: string;
    name: string;
    category?: string;
    notes?: string;
}

export interface UserGearItem extends CommonGearItem {
    quantityNeeded?: number;
    quantityToPack?: number;
    quantityToShop?: number;
}

export interface GearList {
    _id: string;
    listTitle: string;
    items: UserGearItem[];
}