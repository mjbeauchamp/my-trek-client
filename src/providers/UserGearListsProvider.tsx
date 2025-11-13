import { createContext, useState } from "react";
import { Outlet } from "react-router";
import type { GearList } from "../types/gearTypes";

interface UserGearListsContextType {
  userGearLists: GearList[];
  setUserGearLists: React.Dispatch<React.SetStateAction<GearList[]>>;
  getGearListById: (id: string) => GearList | undefined;
}

const UserGearListsContext = createContext<UserGearListsContextType | null>(null);

export default function UserGearListsProvider() {
  const [userGearLists, setUserGearLists] = useState<Array<GearList>>([]);

  const getGearListById = (id: string) => {
    return userGearLists.find(list => list._id === id)
  };

  return (
    <UserGearListsContext.Provider value={{ userGearLists, setUserGearLists, getGearListById }}>
      <Outlet />
    </UserGearListsContext.Provider>
  );
};

export { UserGearListsContext }