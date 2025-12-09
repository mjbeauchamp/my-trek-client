import { useContext } from "react";
import { UserGearListsContext } from "../providers/UserGearListsProvider";

const env = import.meta.env.VITE_ENV;

export default function useUserGearLists() {
  const ctx = useContext(UserGearListsContext);
  if (!ctx) {
    if (env === "development") {
      throw new Error("useUserGearLists must be used inside <UserGearListsProvider>.");
    } else {
      console.warn("UserGearListsProvider missing; using empty fallback.");
      return {
        userGearLists: [],
        setUserGearLists: () => {},
        getGearListById: () => undefined,
      };
    }
  }

  return ctx;
}

