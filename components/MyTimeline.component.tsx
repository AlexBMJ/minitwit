import Head from 'next/head';
import { TUser } from '../models/User.scheme';
import Image from 'next/image';
import { TMessage } from '../models/Message.schema';
import Link from 'next/link';
import { UserInfo } from '../types/userInfo';
import React, { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { KeyedMutator } from 'swr';
import router from 'next/router';
import { fetcherGetWithToken } from '../lib/useUser';
import styles from '../styles/mytimeline.module.scss';

type messageMutatorType = KeyedMutator<{
  messages: TMessage[];
}>;

const MyTimeline: React.FunctionComponent<{
  user?: UserInfo;
  loggedInUser?: TUser;
  messages?: TMessage[];
  messagesMutator?: messageMutatorType;
  isFollowing?: boolean;
  mutateFollower: Dispatch<SetStateAction<boolean>>;
}> = ({ user, loggedInUser, messages, messagesMutator, isFollowing, mutateFollower }) => {
  if (user) {
    return (
      <div className={styles.timeline}>
        <Head>
          <title>{user.username} Timeline</title>
        </Head>

        <h2>{user.username} Timeline</h2>
        <div className={styles.followstatus}>
          {loggedInUser && loggedInUser.username === user.username ? (
            <p>This is you</p>
          ) : (
            <FollowButtons
              loggedInUser={loggedInUser}
              username={user.username}
              mutateFollower={mutateFollower}
              user={loggedInUser?.username ? loggedInUser.username : ''}
              isFollowing={isFollowing ? isFollowing : false}
            />
          )}
        </div>
        {loggedInUser && loggedInUser.username === user.username && (
          <TwitBox messageMutator={messagesMutator} user={loggedInUser} />
        )}
        <Messages messages={user.messages} />
      </div>
    );
  } else {
    return (
      <div className={styles.timeline}>
        <Head>
          <title>Public Timeline</title>
        </Head>

        <h2>Public Timeline</h2>
        {loggedInUser && <TwitBox messageMutator={messagesMutator} user={loggedInUser} />}
        {messages && messages.length > 0 ? <Messages messages={messages} /> : <p>No messages</p>}
      </div>
    );
  }
};

export default MyTimeline;

export const FollowButtons: React.FunctionComponent<{
  loggedInUser?: TUser;
  isFollowing: boolean;
  username: string;
  user: string;
  mutateFollower: Dispatch<SetStateAction<boolean>>;
}> = ({ loggedInUser, isFollowing, username, user, mutateFollower }) => {
  async function doTheFollow(task: 'follow' | 'unfollow') {
    try {
      if (loggedInUser && loggedInUser.username) {
        if (username) {
          await axios.post(
            `/api/fllws/${loggedInUser.username}`,
            task === 'follow' ? { follow: username } : { unfollow: username },
            {
              headers: { authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
            }
          );

          const accessToken = localStorage.getItem('access_token');
          if (accessToken && user) {
            const r = await fetcherGetWithToken(`/api/fllws/${user}?isfollowing=${username}`, accessToken);
            mutateFollower(r.isfollowing);
          }
        } else {
          alert('No username!');
        }
      } else {
        alert('You must be logged in to follow someone!');
        router.push('/login');
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  if (isFollowing) {
    return <button onClick={() => doTheFollow('unfollow')}>Unfollow {username}</button>;
  } else {
    return <button onClick={() => doTheFollow('follow')}>Follow {username}</button>;
  }
};

export const TwitBox: React.FunctionComponent<{ user: TUser; messageMutator: messageMutatorType | undefined }> = ({
  user,
  messageMutator,
}) => {
  const [newMessage, setNewMessage] = useState<string>('');

  async function postMessage(e: React.FormEvent) {
    e.preventDefault();

    if (newMessage) {
      try {
        await axios.post(
          '/api/msgs/' + user.username,
          { content: newMessage },
          { headers: { authorization: `Bearer ${localStorage.getItem('access_token') || ''}` } }
        );

        if (messageMutator) {
          messageMutator();
          setNewMessage('');
        }
      } catch (e: any) {
        console.log(e.response.data);
      }
    } else {
      alert('You must do something');
    }
  }

  return (
    <div className={styles.twitbox}>
      <h3>What is on your mind {user.username}?</h3>
      <form onSubmit={postMessage} method="post">
        <input
          type="text"
          name="text"
          id="text"
          onChange={(e) => setNewMessage(e.target.value)}
          required
          placeholder="What is on your mind?"
          value={newMessage}
        />
        <button type="submit">Share!</button>
      </form>
    </div>
  );
};

export const Messages: React.FunctionComponent<{
  messages: TMessage[];
}> = ({ messages }) => {
  if (messages && messages.length > 0) {
    return (
      <ul className={styles.messages}>
        {messages.map((v, i) => {
          return (
            <li key={i}>
              <div className={styles.image}>
                <div className={styles.messageimage}>
                  <Image
                    alt="Profile picture"
                    src={`https://secure.gravatar.com/avatar/${v.author_id}?d=identicon&s=64`}
                    layout="fill"
                  />
                </div>
              </div>
              <div className={styles.messagecontent}>
                <p className={styles.username}>
                  <Link href={`/timeline/${v.username}`}>{v.username}</Link>
                </p>
                <p className={styles.text}>{v.text}</p>
                <p className={styles.date}>&mdash; {v.pub_date.toString()}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  } else {
    return <p>There are no messages so far!</p>;
  }
};
