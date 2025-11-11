import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "react-router";
import styles from './Navbar.module.scss';
import myTrekLogo from '../../assets/my-trek-logo-green.png';
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';

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
            <Link to="/my-gear-lists">
            {isAuthenticated ? <span>My Gear Lists</span> : <span>Create My List</span>}
            </Link>
          </li>
          <li>
            <Link to="/gear-tips">Gear Tips</Link>
          </li>
        </ul>

        {isAuthenticated ? (
          <div className={styles['profile-container']}>
            <Menu>
              <MenuButton className={styles['profile-menu-button']}>
                { 
                  user?.picture ? 
                  <img className={styles['profile-image']} src={user.picture} alt={user?.name ?? user?.email} /> : 
                  <div className={styles['profile-icon-container']}>
                    <FontAwesomeIcon icon={faUser} color="white" size="xl" />
                  </div>
                }
              </MenuButton>
              <MenuItems className="navbar-menu-items" anchor="bottom end">
                <MenuItem>
                  <div className="menu-item">
                    <Link to="/my-gear-lists">My Gear Lists</Link>
                  </div>
                </MenuItem>
                <MenuSeparator className="menu-separator" />
                <MenuItem>
                  <div className="menu-item">
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                      Log Out
                    </button>
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
            
            

            
          </div>
        ) : (
          <button className="btn light" onClick={() => loginWithRedirect({authorizationParams: {redirect_uri: window.location.href}})}>
            Log In
          </button>
        )}
      </nav>
    </div>
  );
}       