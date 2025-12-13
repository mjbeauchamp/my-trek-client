export interface CommonGearItem {
  _id: string;
  name: string;
  category?: string;
}

export interface UserGearItem extends CommonGearItem {
  quantityNeeded?: number;
  quantityToPack?: number;
  quantityToShop?: number;
  notes?: string;
}

export interface GearList {
  _id: string;
  listTitle: string;
  items: UserGearItem[];
  listDescription?: string;
}
