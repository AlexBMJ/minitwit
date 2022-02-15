import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import useUser from '../lib/useUser';
import { TUser } from '../models/User.scheme';
import styles from '../styles/Index.module.scss';

const Home: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: true, redirectTo: '/' });
  return (
    <div>
      <Layout user={user?.user}>{user?.user && <Timeline endpoint="123" loggedInUser={user.user} />}</Layout>
      <Footer />
    </div>
  );
};

export default Home;
