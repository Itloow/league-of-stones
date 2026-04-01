import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';

export default function About() {
  const team = [
    {
      name: 'Olti MJEKU',
      role: 'Gestion de projet',
      desc: 'Coordination de l\'équipe, suivi de l\'avancement, service API centralisé, polling et redirection matchmaking, écran de victoire/défaite.',
      emoji: '🎯'
    },
    {
      name: 'Asmae ZALOUFI',
      role: 'Responsable qualité',
      desc: 'Conventions de code, revue de code, pages login/register, sélection du deck, actions de jeu (piocher, poser, attaquer), tests fonctionnels.',
      emoji: '✅'
    },
    {
      name: 'Mohammed-Ali CHABANA',
      role: 'Architecte',
      desc: 'Analyse du backend, initialisation du projet React, structure des pages, intégration du thème CSS, déploiement serveur, gestion Git.',
      emoji: '🏗️'
    },
    {
      name: 'Karim SAÏD',
      role: 'Designer',
      desc: 'Maquettes Figma de toutes les pages (mobile et desktop), charte graphique, palette de couleurs, design des cartes, thème CSS global.',
      emoji: '🎨'
    },
    {
      name: 'Hyacinthe WABOE',
      role: 'Responsable mobile',
      desc: 'Responsive de toutes les pages, adaptation mobile, lobby et matchmaking, attaques et fin de tour, tests sur différents appareils.',
      emoji: '📱'
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>League of Stones - À propos</title>
      </Head>

      <div className={styles.logoSection}>
        <img src="/dragon.jpeg" alt="logo" style={{ width: '60px', height: '60px', mixBlendMode: 'multiply' }} />
        <div className={styles.logoText}>LEAGUE OF STONES</div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>ORIGINE DU PROJET</h2>
        <p className={styles.paragraph}>
          League of Stones est un mashup entre les mécaniques stratégiques de Hearthstone et l'univers épique de League of Legends. Deux joueurs s'affrontent avec un deck de 20 champions et 150 points de vie, dans un jeu de cartes au tour par tour où chaque décision compte.
        </p>
        <p className={styles.paragraph}>
          Ce projet a été réalisé dans le cadre du module Programmation Web de la Licence 3 MIASHS à l'Université Toulouse 2 Jean Jaurès. Le client web est développé en React et communique avec un serveur Express.js via des requêtes AJAX.
        </p>

        <h2 className={styles.sectionTitle}>L'ÉQUIPE — GROUPE 6</h2>

        <div className={styles.teamGrid}>
          {team.map((member) => (
            <div key={member.name} className={styles.memberCard}>
              <span className={styles.memberEmoji}>{member.emoji}</span>
              <div className={styles.memberInfo}>
                <span className={styles.memberName}>{member.name}</span>
                <span className={styles.memberRole}>{member.role}</span>
                <p className={styles.memberDesc}>{member.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>TECHNOLOGIES</h2>
        <p className={styles.paragraph}>
          React (Next.js) · Zustand · CSS Modules · LocalStorage · Express.js · MongoDB
        </p>

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