import { useAuth0 } from "@auth0/auth0-react"
import styles from './HomePage.module.scss';
import { Link } from 'react-router';

export default function HomePage() {
  const { isLoading, loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles['hero-text-container']}>
          <h1 className="merriweather">
            <span>Welcome to</span> <span>My Trek</span>
          </h1>
          <p>Your adventure starts here!</p>
          <Link className='btn light' to={isAuthenticated ? '/my-gear-lists/new' : '/my-gear-lists'}>
            CREATE GEAR LIST
          </Link>
        </div>
      </section>

      <section className={`${styles['info-section']}`}>
          <div className="content-container">
            <h2 className="merriweather"><span>Create Custom</span> <span>Gear Lists</span></h2>
            <p>
              Each adventure has its own unique challenges and gear requirements. Create multiple customized gear lists so you're prepared for whatever comes your way.
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
            <Link className='btn dark large' to={isAuthenticated ? '/my-gear-lists/new' : '/my-gear-lists'}>CREATE GEAR LIST</Link>
          </div>
      </section>

      <section className={`${styles['articles-info']} ${styles['info-section']}`}>
        <div className="content-container">
          <h2 className="merriweather">Backpacking 101</h2>
          <p>
            Check out Backpacking 101 to learn more about how to explore the wilderness safely!
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
          <Link className='btn light large' to="/backpacking-101">BACKPACKING 101</Link>
        </div>
      </section>
      
    </div>
  );
}