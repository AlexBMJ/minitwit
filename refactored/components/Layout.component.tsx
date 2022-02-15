import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/layout.module.scss';

const Layout: React.FunctionComponent = ({ children }) => {
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
      <div className="page">
        <h1>MiniTwit</h1>
        <div className="navigiation">
          <Link href="/timeline"> timeline</Link> |<Link href="/register">{g.user ? 'sign up' : 'sign in'}</Link> |
          <Link href="/login">{g.user ? 'sign out' : 'sign in'}</Link> |
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
