import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router';
import './App.scss';
import RootLayout from './layouts/RootLayout/RootLayout';
import HomePage from './pages/HomePage/HomePage';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Backpacking101Page from './pages/Backpacking101Page/Backpacking101Page';
import BackpackingArticlePage from './pages/BackpackingArticlePage/BackpackingArticlePage';
import GearListsPage from './pages/MyGearListsPage/MyGearListsPage';
import GearListPage from './pages/GearListPage/GearListPage';
import CreateGearListPage from './pages/CreateGearListPage/CreateGearListPage';
import UserGearListsProvider from './providers/UserGearListsProvider';
import { parseFetchError } from './utils/parseFetchError';
import { Toaster, toast } from 'react-hot-toast';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const hasSynced = useRef(false);
  const syncStatus = useRef<SyncStatus>('idle');

  useEffect(() => {
    const syncUser = async () => {
      if (isLoading || !isAuthenticated || !user || hasSynced.current || syncStatus.current === 'syncing') return;

      hasSynced.current = true;
      syncStatus.current = 'syncing';

      try {
        const token = await getAccessTokenSilently();

        if (!token) {
          console.error('User sync failed: No user token found');
          toast.error('There was a problem with user sync. Some user features may be unavailable.');
          syncStatus.current = 'error';
          return;
        }

        const res = await fetch('http://localhost:4000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: user.name, email: user.email }),
        });

        if (!res.ok) {
          const message = await parseFetchError(res);
          syncStatus.current = 'error';
          console.error('User sync failed:', message);
          toast.error('There was a problem with user sync. Some user features may be unavailable.');
          return;
        }

        syncStatus.current = 'success';
      } catch (err) {
        console.error('Failed to sync user:', err);
        toast.error('There was a problem with user sync. Some user features may be unavailable.');
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
      <Toaster />
    </>
  );
}

export default App;
