import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router';
import styles from './Navbar.module.scss';
import myTrekLogo from '../../assets/mountain-logo.png';
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const { isLoading, loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <div className={styles['nav-container']}>
      <nav aria-label="Main site nav">
        <ul className={styles['link-list']}>
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
            <Link to="/backpacking-101">Backpacking 101</Link>
          </li>
        </ul>

        {isLoading ? (
          <div className={styles['profile-placeholder']}></div>
        ) : isAuthenticated ? (
          <div className={styles['profile-container']}>
            <Menu>
              <MenuButton className={styles['profile-menu-button']}>
                {user?.picture ? (
                  <img
                    className={styles['profile-image']}
                    src={user.picture}
                    alt={user?.name ?? user?.email}
                    // onError={e => { e.currentTarget.src = '/default-avatar.png'; }}
                  />
                ) : (
                  <div className={styles['profile-icon-container']}>
                    <FontAwesomeIcon icon={faUser} color="white" size="xl" />
                  </div>
                )}
              </MenuButton>
              <MenuItems className="navbar-menu-items" anchor="bottom end">
                <MenuItem>
                  {({ close }) => (
                    <Link to="/my-gear-lists" onClick={close} className="menu-item">
                      My Gear Lists
                    </Link>
                  )}
                </MenuItem>
                <MenuSeparator className="menu-separator" />
                <MenuItem>
                  {({ close }) => (
                    <Link to="/my-gear-lists/new" onClick={close} className="menu-item">
                      Create New List
                    </Link>
                  )}
                </MenuItem>
                <MenuSeparator className="menu-separator" />
                <MenuItem>
                  <div className="menu-item">
                    <button
                      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                      Log Out
                    </button>
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        ) : (
          <button
            className="btn light"
            onClick={() =>
              loginWithRedirect({ authorizationParams: { redirect_uri: window.location.href } })
            }
          >
            Log In
          </button>
        )}
      </nav>
    </div>
  );
}
