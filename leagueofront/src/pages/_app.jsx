import "@/styles/globals.css";
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function App({ Component, pageProps }) {
  const { charger } = useAuthStore();

  useEffect(() => {
    charger();
  }, [charger]);

  return <Component {...pageProps} />;
}