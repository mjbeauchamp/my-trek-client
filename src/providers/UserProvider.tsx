import { createContext, useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface UserContextType {
  isUserLoading: boolean;
  isAuthenticated: boolean;
  user: any;
}

const UserContext = createContext<UserContextType | null>(null);


interface UserProviderProps {
  children: React.ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const hasSynced = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoading || !isAuthenticated || !user || hasSynced.current) return;

      hasSynced.current = true;
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("http://localhost:4000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: user.name, email: user.email }),
        });

        if (!res.ok) {
            // TODO: Handle error with fetching user
          console.error("Failed to sync user");
          return;
        }

                // DO WHATEVER WE WANT TO DO AFTER USER REGISTERS/LOGS IN

      } catch (err) {
        console.error("Failed to sync user:", err);
      } finally {
        setIsUserLoading(false);
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);

  return (
    <UserContext.Provider value={{ isUserLoading, isAuthenticated, user }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext }