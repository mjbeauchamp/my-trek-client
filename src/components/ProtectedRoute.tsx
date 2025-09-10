import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect({
                authorizationParams: {
                    redirect_uri: window.location.href
                }
            });
        }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    if (isLoading) return <div>Checking auth…</div>;
    return isAuthenticated ? children : null;
}