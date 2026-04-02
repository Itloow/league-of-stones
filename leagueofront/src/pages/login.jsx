import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';
import { connexion } from '../services/api';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { login } = useAuthStore();

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const data = await connexion(email, password);
      if (!data) {
        throw new Error('Adresse email ou mot de passe incorrect');
      }
      login(data.token, data.name, data.email);
      router.push('/Accueil');
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>League of Stones - Connexion</title>
      </Head>

      <div className={styles.logoSection}>
        <img src="/~olti.mjeku/webL3/out/dragon.jpeg" alt="logo" style={{ width: '60px', height: '60px', mixBlendMode: 'multiply' }} />
        <div className={styles.logoText}>LEAGUE OF STONES</div>
      </div>


      <div className={styles.form}>
        {error && <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</div>}
        <div className={styles.inputGroup}>
          <label className={styles.label}>ADRESSE MAIL</label>
          <input
            type="email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>MOT DE PASSE</label>
          <input
            type="password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Link href="#" className={styles.forgotPassword}>Mot de passe oublié</Link>

        <button className={styles.btnPrimary} onClick={handleLogin}>CONNEXION</button>
      </div>

      <div className={styles.newPlayerSection}>
        <div className={styles.newPlayerTitle}>NOUVEAUX JOUEURS</div>
        <Link href="/register" style={{ width: '100%' }}>
          <button className={styles.btnPrimary}>INSCRIPTION</button>
        </Link>
      </div>

      {/* Tout en bas de src/pages/index.jsx, remplace le <button> par ce <Link> : */}
      <Link href="/about" className={styles.footerLink}>
        À propos de nous
      </Link>
    </div>
  );
}