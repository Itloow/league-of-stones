import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>League of Stones - Connexion</title>
      </Head>

      <div className={styles.logoSection}>
        <span style={{ fontSize: '40px' }}>🐉</span> {/* Placeholder pour l'icône dragon */}
        <div className={styles.logoText}>LEAGUE OF STONES</div>
      </div>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>ADRESSE MAIL</label>
          <input type="email" className={styles.inputField} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>MOT DE PASSE</label>
          <input type="password" className={styles.inputField} />
        </div>

        <Link href="#" className={styles.forgotPassword}>Mot de passe oublié</Link>

        <button className={styles.btnPrimary}>CONNEXION</button>
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