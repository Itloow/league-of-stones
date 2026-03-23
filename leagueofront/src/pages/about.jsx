import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>League of Stones - À propos</title>
      </Head>

      <div className={styles.logoSection}>
        <span style={{ fontSize: '30px' }}>🐉</span>
        <div className={styles.logoText}>LEAGUE OF STONES</div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>ORIGINE DU PROJET</h2>
        <p className={styles.paragraph}>
          Bienvenue dans l'univers de League of Stones, un projet né de la fusion passionnée entre les mécaniques stratégiques de Hearthstone et l'univers épique de League of Legends. Ce jeu est le fruit d'un travail collaboratif intense réalisé dans le cadre de notre troisième année de Licence d'Informatique à l'Université Toulouse 2 Jean Jaurès.
        </p>

        <h2 className={styles.sectionTitle}>L'ÉQUIPE</h2>
        <ul className={styles.teamList}>
          <li className={styles.teamMember}>
            <span className={styles.memberName}>• Karim SAID</span> — Design UX & Développement Front-End : Architecte de l'interface et de l'expérience utilisateur, veillant à ce que chaque interaction soit intuitive et esthétique.
          </li>
          <li className={styles.teamMember}>
            <span className={styles.memberName}>• Hyacinthe WABOE</span> — Développement Front-End : Responsable de l'intégration et de la mise en vie visuelle du plateau de jeu.
          </li>
          <li className={styles.teamMember}>
            <span className={styles.memberName}>• Olti MJEKU</span> — Développement Back-End : Maître des règles du jeu et de la logique serveur.
          </li>
          <li className={styles.teamMember}>
            <span className={styles.memberName}>• Mohammed-Ali</span> — Développement Back-End : Expert en gestion des données et stabilité du système.
          </li>
          <li className={styles.teamMember}>
            <span className={styles.memberName}>• Asmae ZALOUFI</span> — Développement Back-End : Responsable de l'architecture API et de la communication fluide entre les joueurs.
          </li>
        </ul>

        <h2 className={styles.sectionTitle}>BON JEU !</h2>
        <p className={styles.paragraph}>
          Nous espérons que vous prendrez autant de plaisir à jouer à League of Stones que nous en avons eu à le développer.
        </p>

        <Link href="/" className={styles.btnReturn}>
          🏠 RETOUR AU MENU
        </Link>
      </div>
    </div>
  );
}