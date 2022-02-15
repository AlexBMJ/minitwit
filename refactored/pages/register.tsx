import { NextPage } from 'next';
import Head from 'next/head';
import React, { ReactComponentElement, useState } from 'react';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import styles from '../styles/register.module.scss';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Router from 'next/router';
import useUser from '../lib/useUser';

const Register: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: true, redirectTo: '/' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formBody, setFormBody] = useState<{
    username?: string;
    email?: string;
    password?: string;
    passwordAgain?: string;
  }>({ username: '', email: '', password: '', passwordAgain: '' });

  async function registerUser(e: React.FormEvent) {
    e.preventDefault();

    if (formBody.username && formBody.email && formBody.password && formBody.passwordAgain) {
      if (formBody.password === formBody.passwordAgain) {
        try {
          setErrorMessage('');
          const r = await axios.post('/api/register', formBody);

          if (r.data.token) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', r.data.token);
              alert('Successfully registered!');
              Router.push('/');
            }
          } else {
            setErrorMessage('We could not get your token!');
          }
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
      <>
        <Head>
          <title>Register - MiniTwit</title>
        </Head>
        <Layout>
          <h2>Register</h2>
          {errorMessage && (
            <div className="error">
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
                size={30}
                value={formBody.username}
              />
            </dd>
            <dt>E-Mail:</dt>
            <dd>
              <input
                onChange={(e) => setFormBody({ ...formBody, email: e.target.value })}
                type="text"
                name="email"
                size={30}
                value={formBody.email}
              />
            </dd>
            <dt>Password:</dt>
            <dd>
              <input
                onChange={(e) => setFormBody({ ...formBody, password: e.target.value })}
                type="password"
                name="password"
                size={30}
                value={formBody.password}
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
                size={30}
                value={formBody.passwordAgain}
              />
            </dd>

            <div className="actions">
              <input type="submit" value="Sign Up" />
            </div>
          </form>
        </Layout>
        <Footer />
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default Register;
