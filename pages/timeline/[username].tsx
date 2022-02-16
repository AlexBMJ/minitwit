import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Footer from '../../components/FooterComponent';
import Layout from '../../components/Layout.component';
import Timeline from '../../components/MyTimeline.component';
import useUser, { fetcher } from '../../lib/useUser';
import { TMessage } from '../../models/Message.schema';
import { TUser } from '../../models/User.scheme';
import { UserInfo } from '../../types/userInfo';
import styles from '../styles/Index.module.scss';

const UsernameTimeline: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: false });
  const router = useRouter();
  const { username } = router.query;
  let accessToken = '';
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token') || '';
  }
  const {
    data: isFollowingData,
    mutate: mutateFollow,
    error: errortwo,
  } = useSWR([`/api/${username}/isfollowing`, accessToken], fetcher);

  const [userViewing, setUserViewing] = useState<UserInfo>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

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

    if (isFollowingData) {
      console.log(isFollowingData);
      if (isFollowingData.user === username) {
        setIsFollowing(isFollowingData.isfollowing);
      }
    }
  }, [username, isFollowingData]);

  return (
    <div>
      <Layout user={user?.user}>
        {userViewing ? (
          <Timeline
            loggedInUser={user?.user}
            mutateFollower={mutateFollow}
            isFollowing={isFollowing}
            user={userViewing}
          />
        ) : (
          <p>User not found</p>
        )}
      </Layout>
      <Footer />
    </div>
  );
};

export default UsernameTimeline;
