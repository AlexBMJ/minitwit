import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/layout.module.scss';

const Layout: React.FunctionComponent = () => {
  const g = {
    user: {
      username: '123',
    },
  };

  const [errorMessages, setErrorMessages] = useState<string[]>(['error 1', 'error 2']);

  return (
    <div>
      <Head>
        <title>Welcome | MiniTwit</title>
      </Head>
      <div className={styles.page}>
        <h1>MiniTwit</h1>
        <div className={styles.navigation}>
          <Link href={g.user ? 'timeline' : 'public timeline'}>{g.user ? 'my' : 'public'} timeline</Link> |
          <Link href={g.user ? 'timeline' : 'register'}>{g.user ? 'sign up' : 'sign in'}</Link> |
          <Link href={g.user ? 'logout' : 'login'}>{g.user ? 'sign out' : 'sign in'}</Link> |
        </div>

        {errorMessages.length > 0 && (
          <ul className={styles.flashes}>
            {errorMessages.map((v) => {
              return <li>{v}</li>;
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Layout;
