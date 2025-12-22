import { useAuth0 } from '@auth0/auth0-react';
import styles from './HomePage.module.scss';
import { Link } from 'react-router';

export default function HomePage() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles['hero-text-container']}>
          <h1 className="fjord-one">
            <span>Welcome to</span> <span>Trek List</span>
          </h1>
          <p>
            <span>Your next backpacking</span> <span>adventure starts here!</span>
          </p>
          <Link className="btn light" to={isAuthenticated ? '/my-gear-lists/new' : '/my-gear-lists'}>
            CREATE GEAR LIST
          </Link>
        </div>
      </section>

      <section className={`${styles['info-section']}`}>
        <div className="content-container flex-content-container">
          <h2 className="fjord-one warm-text">
            <span>Create Gear</span> <span>Checklists</span>
          </h2>
          <p className="warm-text">
            Each adventure has its own unique challenges and gear requirements. Create multiple customized gear
            checklists so you're prepared for whatever comes your way!
          </p>
          <p className="warm-text">
            Add items, check them off as you pack, and reuse lists for future trips to save time and avoid forgetting
            essentials.
          </p>
          <Link className="btn dark large" to={isAuthenticated ? '/my-gear-lists/new' : '/my-gear-lists'}>
            GET STARTED
          </Link>
        </div>
      </section>

      <section className={`${styles['articles-info']} ${styles['info-section']}`}>
        <div className="content-container flex-content-container">
          <h2 className="fjord-one">Backpacking 101</h2>
          <p>
            New to backpacking or brushing up on the basics? From choosing the right gear and planning your route to
            understanding weather considerations and Leave No Trace principles, Backpacking 101 is designed to help you
            feel confident before you ever hit the trail.
          </p>
          <p>
            Whether you're preparing for your first overnight trip or refining your setup for longer adventures, these
            guides break down complex topics into practical, easy-to-follow advice.
          </p>
          <Link className="btn light large" to="/backpacking-101">
            BACKPACKING 101
          </Link>
        </div>
      </section>
    </div>
  );
}
