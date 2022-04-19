import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout.component';
import Timeline from '../../components/MyTimeline.component';
import useUser, { fetcherGet, fetcherGetWithToken } from '../../lib/useUser';
import styles from '../../styles/mytimeline.module.scss';
import { TMessage } from '../../models/Message.schema';
import useSWR from 'swr';

const UsernameTimeline: NextPage = () => {
  const { user } = useUser({ redirectIfFound: false });
  const router = useRouter();
  const { username } = router.query;
  let accessToken = '';
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token') || '';
  }
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [pMessages, setPMessages] = useState<TMessage[]>([]);
  const [loadMoreText, setLoadMoreText] = useState<string>('Load more');

  const { data, mutate: mutateMessages } = useSWR<{ messages: TMessage[] }>(
    `/api/msgs/${username}${'?after=' + new Date(pMessages[0]?.pub_date)?.getTime().toString() || ''}`,
    fetcherGet
  );

  useEffect(() => {
    if (data) {
      setPMessages([...data.messages, ...pMessages]);
    }

    (async function getFollower() {
      if (user?.user.username && username) {
        const r = await fetcherGetWithToken(`/api/fllws/${user?.user.username}?isfollowing=${username}`, accessToken);
        setIsFollowing(r.isfollowing);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, data, user, accessToken]);

  async function loadMoreTweets() {
    setLoadMoreText('Loading...');
    const oldestMsgDate = new Date(pMessages[pMessages.length - 1]?.pub_date)?.getTime() || Date.now();
    const r = await fetcherGet(`/api/msgs/${username}?before=${oldestMsgDate}`);

    if (r.messages && r.messages.length > 0) {
      setPMessages([...pMessages, ...r.messages]);
      setLoadMoreText('Load more');
    } else {
      setLoadMoreText('Load more');
      alert('No more messages to load...');
    }
  }

  return (
    <Layout user={user?.user}>
      {username && typeof username === 'string' ? (
        <div>
          <Timeline
            messagesMutator={mutateMessages}
            messages={pMessages}
            loggedInUser={user?.user}
            mutateFollower={setIsFollowing}
            isFollowing={isFollowing}
            username={username}
          />
          <button onClick={() => loadMoreTweets()} className={styles.loadmoretweets} type="button">
            {loadMoreText}
          </button>
        </div>
      ) : (
        <div className={styles.timeline}>
          <h4>User not found</h4>
        </div>
      )}
    </Layout>
  );
};

export default UsernameTimeline;
