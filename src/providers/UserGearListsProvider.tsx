import { createContext, useState, useMemo } from 'react';
import { Outlet } from 'react-router';
import type { GearList } from '../types/gearTypes';

interface UserGearListsContextType {
  userGearLists: GearList[];
  setUserGearLists: React.Dispatch<React.SetStateAction<GearList[]>>;
  getGearListById: (id: string) => GearList | undefined;
  addGearList: (list: GearList) => void;
  removeGearList: (id: string) => void;
}

const UserGearListsContext = createContext<UserGearListsContextType | null>(null);

export default function UserGearListsProvider() {
  const [userGearLists, setUserGearLists] = useState<Array<GearList>>([]);

  const getGearListById = useMemo(
    () => (id: string) => {
      return userGearLists.find((list) => list._id === id);
    },
    [userGearLists],
  );

  const addGearList = (list: GearList) => {
    setUserGearLists((prev) => [...prev, list]);
  };
  const removeGearList = (id: string) => {
    setUserGearLists((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <UserGearListsContext.Provider
      value={{ userGearLists, setUserGearLists, getGearListById, addGearList, removeGearList }}
    >
      <Outlet />
    </UserGearListsContext.Provider>
  );
}

export { UserGearListsContext };
