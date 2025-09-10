import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router";

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading auth…</div>;

  return (
    <nav style={{ padding: "1rem" }}>
      <Link to="/">Home</Link> | <Link to="/gear">Gear</Link>

      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name ?? user?.email}</span>
          {user?.picture ? <img src={user.picture} alt={user?.name ?? user?.email} /> : null}
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log out
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect({authorizationParams: {redirect_uri: window.location.href}})}>
          Log in
        </button>
      )}
    </nav>
  );
}       