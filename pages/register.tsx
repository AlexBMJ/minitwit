import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import Layout from '../components/Layout.component';
import axios from 'axios';
import Router from 'next/router';
import useUser from '../lib/useUser';
import styles from '../styles/auth.module.scss';

const Register: NextPage = () => {
  const { user, error } = useUser({ redirectIfFound: true, redirectTo: '/' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formBody, setFormBody] = useState<{
    username?: string;
    email?: string;
    pwd?: string;
    passwordAgain?: string;
  }>({ username: '', email: '', pwd: '', passwordAgain: '' });

  async function registerUser(e: React.FormEvent) {
    e.preventDefault();

    if (formBody.username && formBody.email && formBody.pwd && formBody.passwordAgain) {
      if (formBody.pwd === formBody.passwordAgain) {
        try {
          setErrorMessage('');
          await axios.post('/api/register', formBody);

          alert('Successfully registered!');
          Router.push('/');
        } catch (err: any) {
          console.log(err.response.data);
          if (err.response.data) {
            setErrorMessage(err.response.data.message);
          } else {
            setErrorMessage('There was an error!');
          }
        }
      } else {
        setErrorMessage('Your passwords must match!');
      }
    } else {
      setErrorMessage('You must fill out all fields!');
    }
  }

  if (!user?.user || error) {
    return (
      <Layout>
        <Head>
          <title>Register</title>
        </Head>
        <div className={styles.auth}>
          <h2>Register</h2>
          {errorMessage && (
            <div className={styles.error}>
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          <form onSubmit={registerUser} method="post">
            <dt>Username:</dt>
            <dd>
              <input
                onChange={(e) => setFormBody({ ...formBody, username: e.target.value })}
                type="text"
                name="username"
                placeholder="Username"
                size={30}
                value={formBody.username}
              />
            </dd>
            <dt>E-Mail:</dt>
            <dd>
              <input
                onChange={(e) => setFormBody({ ...formBody, email: e.target.value })}
                type="email"
                name="email"
                placeholder="Email"
                size={30}
                value={formBody.email}
              />
            </dd>
            <dt>Password:</dt>
            <dd>
              <input
                onChange={(e) => setFormBody({ ...formBody, pwd: e.target.value })}
                type="password"
                name="password"
                placeholder="Password"
                size={30}
                value={formBody.pwd}
              />
            </dd>
            <dt>
              Password <small>(repeat)</small>:
            </dt>
            <dd>
              <input
                onChange={(e) => setFormBody({ ...formBody, passwordAgain: e.target.value })}
                type="password"
                name="password2"
                placeholder="Password 2"
                size={30}
                value={formBody.passwordAgain}
              />
            </dd>

            <div className="actions">
              <button type="submit">Sign up</button>
            </div>
          </form>
        </div>
      </Layout>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default Register;
