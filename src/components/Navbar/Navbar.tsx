import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router";
import styles from './Navbar.module.scss';
import myTrekLogo from '../../assets/my-trek-logo-green.png';

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading auth…</div>;

  return (
    <div className={styles['nav-container']}>
      <nav aria-label="Main site nav">
        <ul className={styles["link-list"]}>
          <li>
            <Link to="/" aria-label="Home">
              <img className={styles['home-logo']} src={myTrekLogo} alt="My Trek Logo" />
            </Link>
          </li>
          <li>
            <Link to="/my-gear-lists">My Gear Lists</Link>
          </li>
          <li>
            <Link to="/gear-tips">Gear Tips</Link>
          </li>
        </ul>

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
    </div>
  );
}       