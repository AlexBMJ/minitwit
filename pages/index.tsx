import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import useUser, { fetcherGet } from '../lib/useUser';
import { TMessage } from '../models/Message.schema';
import styles from '../styles/index.module.scss';

const Home: NextPage = () => {
  const { user } = useUser({ redirectIfFound: false, redirectTo: '/' });
  const [skipNumber, setSkipNumber] = useState(0);
  const R = useRouter();

  const { data, mutate: mutateMessages } = useSWR<{ messages: TMessage[] }>(
    `/api/msgs?no=${R.query.no?.toString() || '20'}&skip=${R.query.skip?.toString() || '0'}`,
    fetcherGet
  );
  const [pMessages, setPMessages] = useState<TMessage[]>([]);

  const { mutate: mutateFollower, error: errorthree } = useSWR('/api/fllws', fetcherGet);

  useEffect(() => {
    // Hent alle beskeder

    if (data) {
      setPMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    if (R.query.skip) {
      setSkipNumber(Number(R.query.skip.toString()) || 0);
    }
  }, [R.query.skip]);

  async function loadMoreTweets() {
    const currentSkip = skipNumber;
    const currentNumber = Number(R.query.no?.toString()) || 20;
    const newSkip = currentSkip + currentNumber;
    try {
      const r = await fetcherGet(`/api/msgs?no=${currentNumber}&skip=${newSkip || '0'}`);

      if (r.messages && r.messages.length > 0) {
        setSkipNumber(newSkip);
        setPMessages([...pMessages, ...r.messages]);
      } else {
        alert('No more messages to load...');
      }
    } catch (err) {
      console.log(err);
      alert('There was an error! Check console');
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
          <button onClick={() => loadMoreTweets()} className={styles.loadmoretweets} type="button">
            Load more
          </button>
        </div>
      ) : (
        <Timeline messagesMutator={mutateMessages} messages={pMessages} mutateFollower={mutateFollower} />
      )}
    </Layout>
  );
};

export default Home;
