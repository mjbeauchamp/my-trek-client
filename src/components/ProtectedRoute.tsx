import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import LoadingMessage from './LoadingMessage/LoadingMessage';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.href,
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
    return <>{showMessage ? <LoadingMessage title="Loading Account Info" text="Hang tight!" /> : null}</>;
  }

  return isAuthenticated ? children : null;
}
