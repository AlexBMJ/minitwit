import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/FooterComponent';
import Layout from '../../components/Layout.component';
import Timeline from '../../components/MyTimeline.component';
import useUser from '../../lib/useUser';
import { TMessage } from '../../models/Message.schema';
import { TUser } from '../../models/User.scheme';
import { UserInfo } from '../../types/userInfo';
import styles from '../styles/Index.module.scss';

const UsernameTimeline: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: false, redirectTo: '/' });
  const router = useRouter();
  const { username } = router.query;
  const [userViewing, setUserViewing] = useState<UserInfo>();

  useEffect(() => {
    if (username) {
      axios
        .get(`/api/${username}`)
        .then((response) => {
          console.log(response.data);
          setUserViewing(response.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  }, [username]);

  return (
    <div>
      <Layout user={user?.user}>
        {userViewing ? <Timeline loggedInUser={user?.user} user={userViewing} /> : <p>User not found</p>}
      </Layout>
      <Footer />
    </div>
  );
};

export default UsernameTimeline;
