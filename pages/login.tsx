import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout.component';
import useUser from '../lib/useUser';
import styles from '../styles/auth.module.scss';

const Login: NextPage = () => {
  const { user, error } = useUser({ redirectIfFound: true, redirectTo: '/' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formBody, setFormBody] = useState<{ username?: string; password?: string }>({ username: '', password: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (formBody.username && formBody.password) {
      try {
        setErrorMessage('');
        const r = await axios.post('/api/login', formBody, {
          headers: {
            authorization: `Basic ${Buffer.from(`${formBody.username}:${formBody.password}`).toString('base64')}`,
          },
        });

        if (r.data.token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', r.data.token);
            Router.push('/');
          }
        } else {
          setErrorMessage('Error getting token!');
        }
      } catch (err: any) {
        console.log(err.response.data);
        if (err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage('There was an errro!');
        }
      }
    } else {
      setErrorMessage('You must fill out all fields!');
    }
  }

  if (!user?.user || error) {
    return (
      <Layout>
        <Head>
          <title>Login</title>
        </Head>
        <div className={styles.auth}>
          <h2>Sign In</h2>

          {errorMessage && (
            <div className={styles.error}>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          <form onSubmit={submit} method="post">
            <div className={styles.inputgroup}>
              <label htmlFor="username">Username:</label>
              <input
                onChange={(e) =>
                  setFormBody({
                    ...formBody,
                    username: e.target.value,
                  })
                }
                placeholder="Username"
                type="text"
                name="username"
                id="username"
                size={30}
              />
            </div>
            <div className={styles.inputgroup}>
              <label htmlFor="password">Password:</label>
              <input
                onChange={(e) =>
                  setFormBody({
                    ...formBody,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
                type="password"
                name="password"
                id="password"
                size={30}
              />
            </div>
            <div>
              <button type="submit">Sign in</button>
            </div>
          </form>
        </div>
      </Layout>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default Login;
