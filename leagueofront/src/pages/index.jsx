import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from './login';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      router.push('/Accueil');
    }
  }, [token, router]);

  if (token) return null;

  return (
    <>
      <Head>
        <title>League of Stones</title>
        <meta name="description" content="League of Stones - Jeu de cartes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/~olti.mjeku/webL3/out/favicon.ico" />
      </Head>

      <Login />
    </>
  );
}