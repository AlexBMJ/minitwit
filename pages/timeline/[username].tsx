import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/FooterComponent';
import Layout from '../../components/Layout.component';
import Timeline from '../../components/MyTimeline.component';
import useUser, { fetcherGetWithToken } from '../../lib/useUser';
import { UserInfo } from '../../types/userInfo';

const UsernameTimeline: NextPage = () => {
  const { user } = useUser({ redirectIfFound: false });
  const router = useRouter();
  const { username } = router.query;
  let accessToken = '';
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token') || '';
  }

  const [userViewing, setUserViewing] = useState<UserInfo>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (username) {
      axios
        .get(`/api/${username}`)
        .then((response) => {
          setUserViewing(response.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }

    (async function getFollower() {
      if (user?.user.username && username) {
        const r = await fetcherGetWithToken(`/api/fllws/${user?.user.username}?isfollowing=${username}`, accessToken);
        setIsFollowing(r.isfollowing);
      }
    })();
  }, [username, user, accessToken]);

  return (
    <div>
      <Layout user={user?.user}>
        {userViewing ? (
          <Timeline
            loggedInUser={user?.user}
            mutateFollower={setIsFollowing}
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
