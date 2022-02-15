import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/FooterComponent';
import Layout from '../../components/Layout.component';
import Timeline from '../../components/MyTimeline.component';
import useUser from '../../lib/useUser';
import { TUser } from '../../models/User.scheme';
import styles from '../styles/Index.module.scss';

const UsernameTimeline: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: false, redirectTo: '/' });
  const router = useRouter();
  const [userViewing, setUserViewing] = useState<TUser>({
    email: 'milb@itu.dk',
    username: 'WATS WRONG',
    pw_hash: '123',
  });

  return (
    <div>
      <Layout user={user?.user}>{user?.user && <Timeline endpoint="123" user={userViewing} />}</Layout>
      <Footer />
    </div>
  );
};

export default UsernameTimeline;
