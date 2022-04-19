import Link from 'next/link';
import { useState } from 'react';
import { logout } from '../lib/useUser';
import { TUser } from '../models/User.scheme';
import styles from '../styles/layout.module.scss';
import Footer from './FooterComponent';

const Layout: React.FunctionComponent<{ user?: TUser }> = ({ children, user }) => {
  const [errorMessages] = useState<string[]>([]);

  return (
    <div className={styles.page}>
      <div className={styles.navigation}>
        <h1>MiniTwit</h1>
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
            <Link href="/">
              <div className={styles.navitem}>
                Timeline
              </div>
            </Link>
            <Link href="/register">
              <div className={styles.navitem}>
                Register
              </div>
            </Link>
            <Link href="/login">
              <div className={styles.navitem}>
                Login
              </div>
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
