import Head from 'next/head';
import { TUser } from '../models/User.scheme';
import styles from './styles/timeline.module.scss';
import Image from 'next/image';
import { TMessage } from '../models/Message.schema';
import mongoose from 'mongoose';
import Link from 'next/link';

const MyTimeline: React.FunctionComponent<{ endpoint: string; user: TUser }> = ({ endpoint, user }) => {
  const testMessages: { poster: TUser; message: TMessage }[] = [
    {
      poster: {
        email: 'mikkel@gmail.com',
        username: 'BECH',
        pw_hash: '1234',
      },
      message: {
        author_id: new mongoose.Types.ObjectId('620c1efc60b10e85373e99fa'),
        flagged: false,
        pub_date: new Date(),
        text: 'This is the message',
      },
    },
    {
      poster: {
        email: 'bech@gmail.com',
        username: 'LETSGOO',
        pw_hash: '1234',
      },
      message: {
        author_id: new mongoose.Types.ObjectId('620c1efc60b10e85373e99fa'),
        flagged: false,
        pub_date: new Date(),
        text: 'This is message 2',
      },
    },
  ];

  console.log(user);
  if (user) {
    return (
      <>
        <Head>
          <title>{user.username} Timeline</title>
        </Head>

        <h2>{user.username} timeline</h2>
        <div className="followstatus">
          <p>This is you</p>
        </div>
        <TwitBox user={user} />
        <Messages messages={testMessages} />
      </>
    );
  } else {
    return <p>User not logged in!</p>;
  }
};

export default MyTimeline;

export const TwitBox: React.FunctionComponent<{ user: TUser }> = ({ user }) => {
  return (
    <div className="twitbox">
      <h3>What is on your mind {user.username}?</h3>
      <form method="post">
        <input type="text" name="text" id="text" required placeholder="What is on your mind?" />
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
      <ul className="messages">
        {messages.map((v, i) => {
          return (
            <li key={i}>
              <div className="messageImage">
                <Image
                  alt="Good image"
                  src="https://secure.gravatar.com/avatar/22bd03ace6f176bfe0c593650bcf45d8"
                  layout="fill"
                />
              </div>
              <Link href={`/timeline/${v.poster.username}`}>{v.poster.username}</Link>
              <p>{v.message.text}</p>
              <small>&mdash; {v.message.pub_date.toString()}</small>
            </li>
          );
        })}
      </ul>
    );
  } else {
    return <p>There is no messages so far!</p>;
  }
};
