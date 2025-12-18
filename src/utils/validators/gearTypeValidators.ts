import type { UserGearItem } from '../../types/gearTypes';

export function isUserGearItem(obj: any): obj is UserGearItem {
  return (
    obj &&
    typeof obj._id === 'string' &&
    typeof obj.name === 'string' &&
    (obj.category === undefined || typeof obj.category === 'string') &&
    (obj.quantityNeeded === undefined || typeof obj.quantityNeeded === 'number') &&
    (obj.quantityToPack === undefined || typeof obj.quantityToPack === 'number') &&
    (obj.quantityToShop === undefined || typeof obj.quantityToShop === 'number') &&
    (obj.notes === undefined || typeof obj.notes === 'string')
  );
}
