import { useEffect, useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router';
import './App.scss';
import RootLayout from './layouts/RootLayout/RootLayout';
import HomePage from './pages/HomePage/HomePage';
import PageNotFound from './pages/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Backpacking101Page from './pages/Backpacking101Page/Backpacking101Page';
import BackpackingArticlePage from './pages/BackpackingArticlePage/BackpackingArticlePage';
import GearListsPage from './pages/MyGearListsPage/MyGearListsPage';
import GearListPage from './pages/GearListPage/GearListPage';
import CreateGearListPage from './pages/CreateGearListPage/CreateGearListPage';
import UserGearListsProvider from './providers/UserGearListsProvider';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [isUserLoading, setIsUserLoading] = useState(true);

  const hasSynced = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (isLoading || !isAuthenticated || !user || hasSynced.current) return;

      hasSynced.current = true;
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch('http://localhost:4000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: user.name, email: user.email }),
        });

        if (!res.ok) {
          // TODO: Handle error with fetching user
        }

        // DO WHATEVER WE WANT TO DO AFTER USER REGISTERS/LOGS IN
      } catch (err) {
        console.error('Failed to sync user:', err);
      } finally {
        setIsUserLoading(false);
      }
    };

    syncUser();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/backpacking-101" element={<Backpacking101Page />} />
          <Route path="/backpacking-101/:articleId" element={<BackpackingArticlePage />} />
          <Route element={<UserGearListsProvider />}>
            <Route path="/my-gear-lists" element={<GearListsPage />} />
            <Route
              path="/my-gear-lists/new"
              element={
                <ProtectedRoute>
                  <CreateGearListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-gear-lists/:listId"
              element={
                <ProtectedRoute>
                  <GearListPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
