import { NextPage } from 'next';
import Head from 'next/head';
import { ReactComponentElement, useState } from 'react';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import styles from '../styles/register.module.scss';

const Register: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>('error');

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Layout>
        <h2>Sign Up</h2>
        {errorMessage && (
          <div className="error">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        <form action="" method="post">
          <dt>Username:</dt>
          <dd>
            <input type="text" name="username" size={30} />
          </dd>
          <dt>E-Mail:</dt>
          <dd>
            <input type="text" name="email" size={30} value="" />
          </dd>
          <dt>Password:</dt>
          <dd>
            <input type="password" name="password" size={30} />
          </dd>
          <dt>
            Password <small>(repeat)</small>:
          </dt>
          <dd>
            <input type="password" name="password2" size={30} />
          </dd>

          <div className="actions">
            <input type="submit" value="Sign Up" />
          </div>
        </form>
      </Layout>
      <Footer />
    </>
  );
};

export default Register;
