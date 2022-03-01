import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { logout } from '../lib/useUser';
import { TUser } from '../models/User.scheme';
import styles from '../styles/layout.module.scss';

const Layout: React.FunctionComponent<{ user?: TUser }> = ({ children, user }) => {
  const g = {
    user: {
      username: '123',
    },
  };

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  return (
    <div>
      <div className="page">
        <h1>MiniTwit</h1>
        <div className="navigiation">
          {user ? (
            <div>
              <Link href="/" passHref>
                {`${user.username} timeline`}
              </Link>
              | <span className={styles.signout} onClick={() => logout({ redirectTo: '/login' })}>Sign out</span> |
            </div>
          ) : (
            <div>
              |<Link href="/">Timeline</Link> | |<Link href="/register">Register</Link> | |
              <Link href="/login">Login</Link> |
            </div>
          )}
        </div>

        {errorMessages.length > 0 && (
          <ul className="flashes">
            {errorMessages.map((v, k) => {
              return <li key={k}>{v}</li>;
            })}
          </ul>
        )}

        {children}
      </div>
    </div>
  );
};

export default Layout;
