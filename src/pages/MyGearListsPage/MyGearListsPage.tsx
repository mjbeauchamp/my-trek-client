import { Link } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import GearLists from '../../components/GearLists/GearLists';
import ActionPanel from '../../components/SharedUi/ActionPanel/ActionPanel';
import LoadingMessage from '../../components/SharedUi/LoadingMessage/LoadingMessage';
import styles from './MyGearListsPage.module.scss';

export default function MyGearListsPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className={`content-container ${styles['my-gear-lists']}`}>
      {isLoading ? (
        <LoadingMessage title="Loading User..." />
      ) : isAuthenticated ? (
        <div className="base-padding-top">
          <header>
            <h1 className={`fjord-one ${styles.header}`}>MY GEAR LISTS</h1>
            <p className={styles.tagline}>Create multiple gear checklists so you're prepared for any adventure!</p>
          </header>

          <hr className={styles['gear-lists-section-line']} />

          {isAuthenticated ? (
            <Link to="/my-gear-lists/new" className="btn large light-green">
              CREATE NEW GEAR LIST
            </Link>
          ) : null}

          <GearLists />
        </div>
      ) : (
        <ActionPanel title="Sign In to Start Planning" headingTag="h2">
          <p>Log in or create your account to get started!</p>
          <p>Once you've signed in, you can create as many gear lists as you want.</p>

          <button
            className="btn dark large"
            // onClick={() => loginWithRedirect({ authorizationParams: { redirect_uri: window.location.href } })}
            onClick={() => loginWithRedirect({ appState: { returnTo: window.location.pathname } })}
          >
            GET STARTED
          </button>
        </ActionPanel>
      )}
    </div>
  );
}
