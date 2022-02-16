import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout.component';

function MyApp({ Component, pageProps }: AppProps) {
  <Layout></Layout>;
  return <Component {...pageProps} />;
}

export default MyApp;
