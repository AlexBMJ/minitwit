import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import styles from '../styles/Index.module.scss';

const Home: NextPage = () => {
  return (
    <div>
      <Layout />
      <Timeline />
      <Footer />
    </div>
  );
};

export default Home;
