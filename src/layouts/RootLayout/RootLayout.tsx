import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Navbar from '../../components/Navbar/Navbar';
import styles from './RootLayout.module.scss';

export default function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={styles['root-layout']}>
      <header>
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; 2025 Trek List. All rights reserved.</p>
      </footer>
    </div>
  );
}
