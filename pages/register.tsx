import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import axios from 'axios';
import Router from 'next/router';
import useUser from '../lib/useUser';

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
                onChange={(e) => setFormBody({ ...formBody, pwd: e.target.value })}
                type="password"
                name="password"
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
