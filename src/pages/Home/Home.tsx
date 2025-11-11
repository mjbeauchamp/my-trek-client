import styles from './Home.module.scss';
import { Link } from 'react-router';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles['hero-text-container']}>
          <h1>Welcome to My Trek</h1>
          <p>Your adventure starts here!</p>
          <Link className='btn light' to="/my-gear-lists">CREATE GEAR LIST</Link>
        </div>
      </section>

      <section className={`${styles['info-section']}`}>
          <div className="content-container">
            <h2>Create Custom Gear Lists</h2>
            <p>
              Each adventure has its own unique requirements. Create as many gear lists as you want so you're prepared for whatever comes your way.
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
            <Link className='btn light' to="/my-gear-lists">CREATE GEAR LIST</Link>
          </div>
      </section>

      <section className={`${styles['articles-info']} ${styles['info-section']}`}>
        <div className="content-container">
          <h2>Create Custom Gear Lists</h2>
          <p>
            Each adventure has its own unique requirements. Create as many gear lists as you want so you're prepared for whatever comes your way.
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
          <Link className='btn light' to="/my-gear-lists">CREATE GEAR LIST</Link>
        </div>
      </section>
      
    </div>
  );
}