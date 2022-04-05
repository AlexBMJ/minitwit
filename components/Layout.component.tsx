import Link from 'next/link';
import { useState } from 'react';
import { logout } from '../lib/useUser';
import { TUser } from '../models/User.scheme';
import styles from '../styles/layout.module.scss';

const Layout: React.FunctionComponent<{ user?: TUser }> = ({ children, user }) => {
  const [errorMessages] = useState<string[]>([]);

  return (
    <div className={styles.page}>
      <div className={styles.navigation}>
        <h1>MiniTwit</h1>
        {user ? (
          <div className={styles.navitems}>
            <div className={styles.navitem}>
              <Link href="/">Public Timeline</Link>
            </div>
            <div className={styles.navitem}>
              <Link href={`/timeline/${user.username}`}>My Timeline</Link>
            </div>
            <div className={styles.navitem} onClick={() => logout({ redirectTo: '/login' })}>
              Sign out
            </div>
          </div>
        ) : (
          <div className={styles.navitems}>
            <div className={styles.navitem}>
              <Link href="/">Timeline</Link>
            </div>
            <div className={styles.navitem}>
              <Link href="/register">Register</Link>
            </div>
            <div className={styles.navitem}>
              <Link href="/login">Login</Link>
            </div>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <ul className={styles.errorMessage}>
          <li>test</li>
          <li>test</li>
        </ul>

        {errorMessages.length > 0 && (
          <ul className="flashes">
            {errorMessages.map((v, k) => {
              return <li key={k}>{v}</li>;
            })}
          </ul>
        )}

        {children}
        <div className={styles.footer}>
          <p>Footer</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;
