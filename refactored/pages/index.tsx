import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import useUser, { fetcherGet } from '../lib/useUser';
import { TMessage } from '../models/Message.schema';
import { TUser } from '../models/User.scheme';
import styles from '../styles/Index.module.scss';
import { UserInfo } from '../types/userInfo';

const Home: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: false, redirectTo: '/' });
  const {
    data,
    mutate: mutateMessages,
    error: errortwo,
  } = useSWR<{ messages: TMessage[] }>('/api/messages/20/recent', fetcherGet);
  const [pMessages, setPMessages] = useState<TMessage[]>([]);

  useEffect(() => {
    // Hent alle beskeder
    if (data) {
      setPMessages(data.messages);
    }
  }, [data]);

  return (
    <div>
      <Layout user={user?.user}>
        {user?.user && <Timeline messagesMutator={mutateMessages} messages={pMessages} loggedInUser={user.user} />}
      </Layout>
      <Footer />
    </div>
  );
};

export default Home;
