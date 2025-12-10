import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { SyncLoader } from "react-spinners";
import styles from "./ProtectedRoute.module.scss"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
    const [showMessage, setShowMessage] = React.useState(false);

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect({
                authorizationParams: {
                    redirect_uri: window.location.href
                }
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
        return (
            <>
                { showMessage ? 
                    <div role="status" className={styles['protected-route']}>
                        <h1>Loading Account Info</h1>
                        <p>Hang tight!</p>
                        <SyncLoader />
                    </div> : null
                }
            </>
        );
    }

    return isAuthenticated ? children : null;
}