import { createContext, useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router"
import './App.scss'
import RootLayout from "./layouts/RootLayout/RootLayout"
import HomePage from "./pages/HomePage/HomePage"
import PageNotFound from "./pages/PageNotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Backpacking101Page from "./pages/Backpacking101Page/Backpacking101Page"
import BackpackingArticlePage from "./pages/BackpackingArticlePage/BackpackingArticlePage"
import GearListsPage from "./pages/MyGearListsPage/MyGearListsPage"
import GearListPage from "./pages/GearListPage/GearListPage"

// @ts-ignore
const UserContext = createContext();

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [databaseUser, setDatabaseUser] = useState(null); 
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
        }

        const dbUser = await res.json();

        setDatabaseUser(dbUser);
      } catch (err) {
        console.error("Failed to sync user:", err);
      } finally {
        setIsUserLoading(false);
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);

  return (
    <>
      <UserContext.Provider value={{ databaseUser, isUserLoading, isAuthenticated, user }}>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/backpacking-101" element={<Backpacking101Page />} />
            <Route path="/backpacking-101/:articleId" element={<BackpackingArticlePage />} />
            <Route path="/my-gear-lists" element={<GearListsPage />} />
            <Route path="/my-gear-lists/:listId" element={<ProtectedRoute><GearListPage /></ProtectedRoute>} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App;

export { UserContext };
