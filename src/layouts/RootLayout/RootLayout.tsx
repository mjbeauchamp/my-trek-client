import { Outlet } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import styles from './RootLayout.module.scss'

export default function RootLayout() {
  return (
    <div className={styles['root-layout']}>
      <header>
        <Navbar />
      </header>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}