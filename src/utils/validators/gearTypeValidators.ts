export function isUserGearItem(obj: any) {
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

export function isArrayOfGearLists(listArray: any) {
  if (!listArray || !Array.isArray(listArray)) {
    return false;
  }

  return listArray.every((list: any) => {
    return (
      typeof list.listTitle === 'string' &&
      Array.isArray(list.items) &&
      list.items.every((item: any) => isUserGearItem(item))
    );
  });
}
