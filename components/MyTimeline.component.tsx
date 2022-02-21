import Head from 'next/head';
import { TUser } from '../models/User.scheme';
import styles from './styles/timeline.module.scss';
import Image from 'next/image';
import { TMessage } from '../models/Message.schema';
import mongoose from 'mongoose';
import Link from 'next/link';
import { UserInfo } from '../types/userInfo';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { KeyedMutator } from 'swr';

type messageMutatorType = KeyedMutator<{
  messages: TMessage[];
}>;

type mutateFollowerType = KeyedMutator<any>;

const MyTimeline: React.FunctionComponent<{
  user?: UserInfo;
  loggedInUser?: TUser;
  messages?: TMessage[];
  messagesMutator?: messageMutatorType;
  isFollowing?: boolean;
  mutateFollower?: mutateFollowerType;
}> = ({ user, loggedInUser, messages, messagesMutator, isFollowing, mutateFollower }) => {
  if (user) {
    return (
      <>
        <Head>
          <title>{user.username} Timeline</title>
        </Head>

        <h2>{user.username} timeline</h2>
        <div className="followstatus">
          {loggedInUser && loggedInUser.username === user.username ? (
            <p>This is you</p>
          ) : (
            <FollowButtons
              mutateFollower={mutateFollower}
              username={user.username}
              isFollowing={isFollowing ? isFollowing : false}
            />
          )}
        </div>
        {loggedInUser && loggedInUser.username === user.username && (
          <TwitBox messageMutator={messagesMutator} user={loggedInUser} />
        )}
        <Messages messages={user.messages} />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Public timeline</title>
        </Head>

        <h2>Public timeline</h2>
        {loggedInUser && <TwitBox messageMutator={messagesMutator} user={loggedInUser} />}
        {messages && messages.length > 0 ? <Messages messages={messages} /> : <p>No messages</p>}
      </>
    );
  }
};

export default MyTimeline;

export const FollowButtons: React.FunctionComponent<{
  isFollowing: boolean;
  username: string;
  mutateFollower: mutateFollowerType | undefined;
}> = ({ isFollowing, username, mutateFollower }) => {
  async function doTheFollow(task: 'follow' | 'unfollow') {
    try {
      if (username) {
        const r = await axios.post(
          `/api/${username}/${task}`,
          {},
          {
            headers: { authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
          }
        );

        if (mutateFollower) {
          mutateFollower();
        }
      } else {
        alert('No username!');
      }
    } catch (e: any) {
      console.log(e.response.data);
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
        const r = await axios.post(
          '/api/msgs/' + user.username,
          { content: newMessage },
          { headers: { authorization: `Bearer ${localStorage.getItem('access_token') || ''}` } }
        );

        if (messageMutator) {
          messageMutator();
        }
      } catch (e: any) {
        console.log(e.response.data);
      }
    } else {
      alert('You must do somehting');
    }
  }

  return (
    <div className="twitbox">
      <h3>What is on your mind {user.username}?</h3>
      <form onSubmit={postMessage} method="post">
        <input
          type="text"
          name="text"
          id="text"
          onChange={(e) => setNewMessage(e.target.value)}
          required
          placeholder="What is on your mind?"
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
              <Link href={`/timeline/${v.author_name}`}>{v.author_name}</Link>
              <p>{v.text}</p>
              <small>&mdash; {v.pub_date.toString()}</small>
            </li>
          );
        })}
      </ul>
    );
  } else {
    return <p>There is no messages so far!</p>;
  }
};
