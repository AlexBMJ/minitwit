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

function parseDate(d: Date): string {
  
  return (
    ('0' + d.getDate()).slice(-2) + 
    '-' + ('0'+(d.getMonth()+1)).slice(-2) + 
    '-' +d.getFullYear() + 
    ' ' + ('0' + d.getHours()).slice(-2) + ':' + 
    ('0' + d.getMinutes()).slice(-2)
  );
}

const MyTimeline: React.FunctionComponent<{
  username?: string;
  loggedInUser?: TUser;
  messages?: TMessage[];
  messagesMutator?: messageMutatorType;
  isFollowing?: boolean;
  mutateFollower: Dispatch<SetStateAction<boolean>>;
}> = ({ username, loggedInUser, messages, messagesMutator, isFollowing, mutateFollower }) => {
  if (username) {
    return (
      <div className={styles.timeline}>
        <Head>
          <title>{username} Timeline</title>
        </Head>
        <h2>{username} Timeline</h2>
        <div className={styles.followstatus}>
          {loggedInUser && loggedInUser.username === username ? (
            <p>This is you</p>
          ) : (
            <FollowButtons
              loggedInUser={loggedInUser}
              username={username}
              mutateFollower={mutateFollower}
              user={loggedInUser?.username ? loggedInUser.username : ''}
              isFollowing={isFollowing ? isFollowing : false}
            />
          )}
        </div>
        {loggedInUser && loggedInUser.username === username && (
          <TwitBox messageMutator={messagesMutator} user={loggedInUser} />
        )}
        {messages && messages.length > 0 ? (
          <Messages messages={messages} />
        ) : (
          <h4>
            <Image alt="No tweets found" src="/empty_box.png" layout="fixed" width="64" height="64" />
            <br />
            <br />
            No Tweets Found
          </h4>
        )}
        ;
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
        {messages && messages.length > 0 ? (
          <Messages messages={messages} />
        ) : (
          <h4>
            <Image alt="No tweets found" src="/empty_box.png" layout="fixed" width="64" height="64" />
            <br />
            <br />
            No Tweets Found
          </h4>
        )}
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
                <p className={styles.date}>&mdash; {parseDate(new Date(v.pub_date))}</p>

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
