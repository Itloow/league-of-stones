import Head from 'next/head';
import Link from 'next/link'; // Super important pour la navigation interne (CM3)
import styles from '../styles/Home.module.css'; // Notre module CSS local

export default function Home() {
  return (
    <>
      <Head>
        <title>League of Stones - Bienvenue</title>
        <meta name="description" content="Le jeu de cartes stratégique de la L3 Web" />
      </Head>

      {/* HEADER : Navigation en haut de page */}
      <header style={{ background: '#000', padding: '20px 10%', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#f0e6d2' }}>LEAGUE OF STONES</div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <span style={{ cursor: 'pointer', color: '#00c8ff' }}>Accueil</span>
          <span style={{ cursor: 'pointer' }}>Jouer</span>
          <span style={{ cursor: 'pointer' }}>Cartes</span>
        </nav>
      </header>

      <main className={styles.main}>
        {/* SECTION 1 : Le Hero (Haut de page avec le bouton d'inscription) */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>BIENVENUE SUR LEAGUE OF STONES</h1>
            <p className={styles.heroDescription}>
              Préparez-vous à entrer dans l'arène ! Collectionnez des cartes légendaires inspirées de l'univers de League of Legends et affrontez d'autres joueurs dans des duels épiques.
            </p>
            <div className={styles.heroBtns}>
              {/* Utilisation de <Link> pour naviguer sans recharger la page entière */}
              <Link href="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
                SE CONNECTER
              </Link>
              <Link href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
                S'INSCRIRE
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            {/* Espace réservé pour l'image du champion (Garen) de Karim */}
            <div style={{ border: '2px dashed #333', padding: '100px', color: '#555', borderRadius: '8px' }}>
              [Image du Champion ici]
            </div>
          </div>
        </section>

        {/* SECTION 2 : Les fonctionnalités du jeu */}
        <section className={styles.features}>
          <h2 className={styles.featuresTitle}>DÉCOUVREZ LE JEU</h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💎</div>
              <h3 className={styles.featureCardTitle}>Collectionnez</h3>
              <p className={styles.featureCardDesc}>Plus de 170 champions à collectionner et à intégrer dans vos decks stratégiques.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚔️</div>
              <h3 className={styles.featureCardTitle}>Combattez</h3>
              <p className={styles.featureCardDesc}>Affrontez des joueurs du monde entier dans des duels rapides et intenses.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3 className={styles.featureCardTitle}>Évoluez</h3>
              <p className={styles.featureCardDesc}>Montez en grade dans le classement et débloquez des récompenses exclusives.</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER : Pied de page */}
      <footer style={{ background: '#000', padding: '40px 10%', color: '#666', textAlign: 'center', borderTop: '1px solid #333' }}>
        <p>&copy; 2026 League of Stones. Projet L3 Web.</p>
      </footer>
    </>
  );
}