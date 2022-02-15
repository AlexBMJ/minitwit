import Head from 'next/head';
import { TUser } from '../models/User.scheme';
import styles from './styles/timeline.module.scss';
import Image from 'next/image';
import { TMessage } from '../models/Message.schema';

const MyTimeline: React.FunctionComponent<{ endpoint: string; loggedInUser: TUser }> = ({ endpoint, loggedInUser }) => {
  if (loggedInUser) {
    return (
      <>
        <Head>
          <title>{loggedInUser.username} Timeline</title>
        </Head>

        <h2>{loggedInUser.username} timeline</h2>
        <div className={styles.followstatus}>
          <p>This is you</p>
        </div>
        <TwitBox loggedInUser={loggedInUser} />
      </>
    );
  } else {
    return <p>User not logged in!</p>;
  }
};

export default MyTimeline;

export const TwitBox: React.FunctionComponent<{ loggedInUser: TUser }> = ({ loggedInUser }) => {
  return (
    <div className={styles.twitbox}>
      <h3>What is on your mind {loggedInUser.username}?</h3>
      <form method="post">
        <textarea name="text" id="text" cols={30} rows={10}></textarea>
        <button type="submit">Share!</button>
      </form>
    </div>
  );
};

export const Messages: React.FunctionComponent<{
  messages: { poster: TUser; message: TMessage }[];
}> = ({ messages }) => {
  if (messages.length > 0) {
    return (
      <ul>
        {messages.map((v, i) => {
          return (
            <li key={i}>
              <div className={styles.image}>
                <Image alt="Good image" src={'123'} layout="fill" />
              </div>
              <a href="timeline">{v.poster.username}</a>
              <p>{v.message.text}</p>
              <small>&mdash; {v.message.pub_date}</small>
            </li>
          );
        })}
      </ul>
    );
  } else {
    return <p>There is no messages so far!</p>;
  }
};
