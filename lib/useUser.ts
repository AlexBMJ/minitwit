import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Router from 'next/router';
import { TUser } from '../models/User.scheme';
import axios from 'axios';

export const fetcher = (url: string, token: string) =>
  axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);

export const fetcherGet = (url: string) => axios.get(url).then((res) => res.data);

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const [isLoading, setIsLoading] = useState(true);

  let accessToken = '';
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token') || '';
  }

  let { data: user, mutate: mutateUser, error } = useSWR<{ user: TUser }>(['/api/login', accessToken], fetcher);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet

    if ((!redirectTo || !user?.user?.email) && !error) {
      return;
    }
    
    if (error) {
      
      if (redirectTo && !redirectIfFound) {
        setIsLoading(false);
        
        if (redirectIfFound) {
          return;
        }

        Router.push(redirectTo);
      }
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.user?.email) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.user?.email)
    ) {
      setIsLoading(false);
      Router.push(redirectTo);
    }

    if (user?.user?.email) {
      setIsLoading(false);
    }
  }, [user, redirectIfFound, redirectTo, error]);

  return { user, mutateUser, isLoading, error };
}

export async function logout({ redirectTo = '' }: { redirectTo: string }) {
  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('access_token') || '';
    localStorage.clear();
    Router.push(redirectTo);
  }
}
