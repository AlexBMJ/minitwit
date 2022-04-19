import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import { logout } from '../lib/useUser';
import { TUser } from '../models/User.scheme';
import styles from '../styles/layout.module.scss';
import Footer from './FooterComponent';

const Layout: React.FunctionComponent<{ user?: TUser }> = ({ children, user }) => {
  const [errorMessages] = useState<string[]>([]);
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  return (
    <div className={styles.page}>
      <div className={navbarOpen ? classNames(styles.navigation, styles.navigationOpen) : styles.navigation}>
        <div onClick={() => setNavbarOpen(!navbarOpen)} className={styles.mobileNav}>
          ☰
        </div>

        <h1>
          <Link href="/">MiniTwit</Link>
        </h1>
        {user ? (
          <div className={styles.navitems}>
            <Link href="/" passHref>
              <div className={styles.navitem}>Public Timeline</div>
            </Link>
            <Link href={`/timeline/${user.username}`} passHref>
              <div className={styles.navitem}>My Timeline</div>
            </Link>
            <div className={styles.navitem} onClick={() => logout({ redirectTo: '/login' })}>
              Sign out
            </div>
          </div>
        ) : (
          <div className={styles.navitems}>
            <Link href="/" passHref>
              <div className={styles.navitem}>Timeline</div>
            </Link>
            <Link href="/register" passHref>
              <div className={styles.navitem}>Register</div>
            </Link>
            <Link href="/login" passHref>
              <div className={styles.navitem}>Login</div>
            </Link>
          </div>
        )}
      </div>
      <div className={styles.content}>
        {errorMessages.length > 0 && (
          <ul className={styles.errorMessage}>
            {errorMessages.map((v, k) => {
              return <li key={k}>{v}</li>;
            })}
          </ul>
        )}

        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
