import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import useUser, { fetcherGet } from '../lib/useUser';
import { TMessage } from '../models/Message.schema';
import styles from '../styles/mytimeline.module.scss';

const Home: NextPage = () => {
  const { user } = useUser({ redirectIfFound: false, redirectTo: '/' });
  const [pMessages, setPMessages] = useState<TMessage[]>([]);

  const { data, mutate: mutateMessages } = useSWR<{ messages: TMessage[] }>(
    `/api/msgs${'?after=' + new Date(pMessages[0]?.pub_date)?.getTime().toString() || ''}`,
    fetcherGet
  );

  const { mutate: mutateFollower } = useSWR('', fetcherGet);

  useEffect(() => {
    if (data) {
      setPMessages([...data.messages, ...pMessages]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function loadMoreTweets() {
    const oldestMsgDate = new Date(pMessages[pMessages.length - 1]?.pub_date)?.getTime() || Date.now();
    const r = await fetcherGet(`/api/msgs?before=${oldestMsgDate}`);

    if (r.messages && r.messages.length > 0) {
      setPMessages([...pMessages, ...r.messages]);
    } else {
      alert('No more messages to load...');
    }
  }

  return (
    <Layout user={user?.user}>
      {user?.user ? (
        <div>
          <Timeline
            messagesMutator={mutateMessages}
            messages={pMessages}
            loggedInUser={user.user}
            mutateFollower={mutateFollower}
          />
        </div>
      ) : (
        <div>
          <Timeline messagesMutator={mutateMessages} messages={pMessages} mutateFollower={mutateFollower} />
        </div>
      )}
      <button onClick={() => loadMoreTweets()} className={styles.loadmoretweets} type="button">
        Load more
      </button>
    </Layout>
  );
};

export default Home;
