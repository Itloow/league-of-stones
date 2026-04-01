import "@/styles/globals.css";
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function App({ Component, pageProps }) {
  const { token, charger } = useAuthStore();

  useEffect(() => {
    charger();
  }, [charger]);

  return (
    <>
      {/* Masque vert clair quand l'utilisateur est connecté (cahier des charges §3.2.3) */}
      {token && <div className="overlay-connected" />}
      <Component {...pageProps} />
    </>
  );
}