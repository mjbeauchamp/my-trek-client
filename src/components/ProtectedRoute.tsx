import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import LoadingMessage from './SharedUi/LoadingMessage/LoadingMessage';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  React.useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setShowMessage(true), 700);

      return () => clearTimeout(timeout);
    } else {
      setShowMessage(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return <>{showMessage ? <LoadingMessage title="Loading User Info..." text="Hang tight!" /> : null}</>;
  }

  return isAuthenticated ? children : null;
}
