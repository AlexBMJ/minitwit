import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Footer from '../components/FooterComponent';
import Layout from '../components/Layout.component';
import Timeline from '../components/MyTimeline.component';
import useUser, { fetcherGet } from '../lib/useUser';
import { TMessage } from '../models/Message.schema';

const Home: NextPage = () => {
  const { user, mutateUser, error } = useUser({ redirectIfFound: false, redirectTo: '/' });

  const {
    data,
    mutate: mutateMessages,
    error: errortwo,
  } = useSWR<{ messages: TMessage[] }>('/api/msgs?no=20', fetcherGet);
  const [pMessages, setPMessages] = useState<TMessage[]>([]);

  const { mutate: mutateFollower, error: errorthree } = useSWR('/api/fllws', fetcherGet);

  useEffect(() => {
    // Hent alle beskeder
    if (data) {
      setPMessages(data.messages);
    }
  }, [data]);

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
