import { useContext } from 'react';
import { UserGearListsContext } from '../providers/UserGearListsProvider';

export default function useUserGearLists() {
  const ctx = useContext(UserGearListsContext);
  if (!ctx) {
    throw new Error('useUserGearLists must be used inside <UserGearListsProvider>.');
  }

  return ctx;
}
