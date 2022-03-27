import type { NextPage } from 'next';
<<<<<<< Updated upstream
=======
import { useRouter } from 'next/router';
>>>>>>> Stashed changes
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import useUser, { fetcherGet } from '../lib/useUser';
import { TMessage } from '../models/Message.schema';

const Home: NextPage = () => {
  const { user } = useUser({ redirectIfFound: false, redirectTo: '/' });

  const { data, mutate: mutateMessages } = useSWR<{ messages: TMessage[] }>('/api/msgs?no=20', fetcherGet);
  const [pMessages, setPMessages] = useState<TMessage[]>([]);

  const { mutate: mutateFollower } = useSWR('/api/fllws', fetcherGet);

  useEffect(() => {
<<<<<<< Updated upstream
    // Hent alle beskeder
=======
    // Fetch all messages

>>>>>>> Stashed changes
    if (data) {
      setPMessages(data.messages);
    }
  }, [data]);

<<<<<<< Updated upstream
=======
  useEffect(() => {
    if (R.query.skip) {
      setSkipNumber(Number(R.query.skip.toString()) || 0);
    }
  }, []);

  async function loadMoreTweets() {
    const currentSkip = skipNumber;
    const currentNumber = Number(R.query.no?.toString());
    const newSkip = currentSkip + currentNumber;
    const r = await fetcherGet(`/api/msgs?no=${R.query.no?.toString() || '20'}&skip=${newSkip || '0'}`);

    setSkipNumber(newSkip);
    setPMessages([...pMessages, ...r.messages]);
  }

>>>>>>> Stashed changes
  return (
    <div>
      <Layout user={user?.user}>
        {user?.user ? (
          <Timeline
            messagesMutator={mutateMessages}
            messages={pMessages}
            loggedInUser={user.user}
            mutateFollower={mutateFollower}
          />
        ) : (
          <Timeline messagesMutator={mutateMessages} messages={pMessages} mutateFollower={mutateFollower} />
        )}
      </Layout>
      <Footer />
    </div>
  );
};

export default Home;
