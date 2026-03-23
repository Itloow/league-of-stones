import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Success.module.css';

export default function Success() {
  return (
    <div className={styles.container}>
      <Head>
        <title>League of Stones - Succès</title>
      </Head>

      <h1 className={styles.title}>
        COMPTE CRÉÉ AVEC SUCCÉS&nbsp;! <span className={styles.icon}>✓</span>
      </h1>

      {/* Le bouton redirige vers l'accueil (la page de connexion) */}
      <Link href="/" className={styles.btnNext}>
        SUIVANT →
      </Link>
    </div>
  );
}