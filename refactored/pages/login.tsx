import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import styles from '../styles/login.module.scss';

const Login: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>('error');
  const [formBody, setFormBody] = useState<{ userName?: string; password?: string }>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div>
      <Head>
        <title>Sign In</title>
      </Head>

      <h2>Sign In</h2>

      {errorMessage && (
        <div className="error">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      <form onSubmit={submit} method="post">
        <dl>
          <dt>Username:</dt>
          <dd>
            <input
              onChange={(e) =>
                setFormBody({
                  ...formBody,
                  userName: e.target.value,
                })
              }
              type="text"
              name="username"
              size={30}
            />
          </dd>
          <dt>Password:</dt>
          <dd>
            <input
              onChange={(e) =>
                setFormBody({
                  ...formBody,
                  password: e.target.value,
                })
              }
              type="password"
              name="password"
              size={30}
            />
          </dd>
        </dl>
        <div className="actions">
          <input type="submit" value="Sign In" />
        </div>
      </form>
    </div>
  );
};

export default Login;
