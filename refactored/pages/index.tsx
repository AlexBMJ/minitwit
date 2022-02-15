import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import { TUser } from '../models/User.scheme';
import styles from '../styles/Index.module.scss';

const Home: NextPage = () => {
  const testUser: TUser = {
    email: 'mikkel@gmail.com',
    username: 'BECH',
    pw_hash: '123',
  };

  return (
    <div>
      <Layout>
        <Timeline endpoint="123" loggedInUser={testUser} />
      </Layout>

      <Footer />
    </div>
  );
};

export default Home;
