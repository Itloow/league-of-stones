import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Accueil.module.css';
import { useAuthStore } from '../store/authStore';
import { getAllPlayers } from '../services/api';
import { Layers, Home, User, Users } from 'lucide-react';

export default function Accueil() {
    const router = useRouter();
    const { token } = useAuthStore();

    const [deckCards, setDeckCards] = useState([]);
    const [onlinePlayers, setOnlinePlayers] = useState([]);

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token, router]);

    useEffect(() => {
        const savedDeck = localStorage.getItem('myDeck');
        if (savedDeck) {
            try {
                setDeckCards(JSON.parse(savedDeck));
            } catch (e) {
                console.error("Erreur parsing deck:", e);
            }
        }

        const fetchOnlinePlayers = async () => {
            try {
                const players = await getAllPlayers();
                if (players && Array.isArray(players)) {
                    setOnlinePlayers(players);
                }
            } catch (err) {
                console.log("Pas de joueurs en ligne");
            }
        };

        if (token) fetchOnlinePlayers();
    }, [token]);

    const [isSearching, setIsSearching] = useState(false);

    const handleLancerPartie = () => {
        setIsSearching(true);
        // On simule un temps de recherche puis on redirige vers le lobby
        setTimeout(() => {
            router.push('/matchmaking');
        }, 3000);
    };
    const handleModifierDeck = () => router.push('/deck');
    const handleInviter = (id) => router.push('/lobby?invite=' + id);

    const renderDeckPreview = () => {
        const slots = [];
        // Afficher les cartes existantes
        deckCards.forEach((card, i) => {
            slots.push(
                <img
                    key={i}
                    src={'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + card.key + '_0.jpg'}
                    alt={card.name || card.key}
                    className={styles.deckCard}
                />
            );
        });
        // Remplir les emplacements vides avec des placeholders "?"
        for (let i = deckCards.length; i < 20; i++) {
            slots.push(
                <div key={'empty-' + i} className={styles.deckCardPlaceholder}>?</div>
            );
        }
        return slots;
    };

    return (
        <>
            {/* ===== OVERLAY MATCHMAKING ===== */}
            {isSearching && (
                <div className={styles.matchmakingOverlay}>
                    <div className={styles.matchmakingBox}>
                        <div className={styles.spinner}></div>
                        <h2 className={styles.matchmakingTitle}>Matchmaking</h2>
                        <p className={styles.matchmakingText}>Recherche d'un adversaire...</p>
                        <button className={styles.btnCancel} onClick={() => setIsSearching(false)}>
                            ✕ Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* ===== NAVBAR DESKTOP (masquée en mobile) ===== */}
            <div className={styles.navbarDesktop}>
                <Navbar />
            </div>

            {/* ===== CONTENU DESKTOP — 3 colonnes ===== */}
            <div className={styles.pageContent}>
                <div className={styles.deckSection}>
                    <h2 className={styles.sectionTitle}>Votre Deck</h2>
                    <div className={styles.deckContainer}>
                        {renderDeckPreview()}
                    </div>
                    <button className={styles.btnModifierDeck} onClick={handleModifierDeck}>
                        📋 Modifier le deck
                    </button>
                </div>

                <div className={styles.centerSection}>
                    <button className={styles.btnLancerPartie} onClick={handleLancerPartie}>
                        <span className={styles.playIcon}>▶</span>
                        Lancer une partie
                    </button>
                </div>

                <div className={styles.friendsSection}>
                    <h2 className={styles.sectionTitle}>Amis en ligne</h2>
                    <div className={styles.friendsContainer}>
                        {onlinePlayers.length > 0 ? (
                            <table className={styles.friendsTable}>
                                <thead>
                                    <tr>
                                        <th>Pseudo</th>
                                        <th>Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {onlinePlayers.map((player, index) => (
                                        <tr key={player.matchmakingId || index}>
                                            <td>{player.name}</td>
                                            <td>
                                                <button className={styles.btnInviter} onClick={() => handleInviter(player.matchmakingId)}>
                                                    🎮 Envoyer une invitation
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className={styles.noFriends}>Aucun joueur en ligne pour le moment...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== CONTENU MOBILE — Logo centré + bouton ===== */}
            <div className={styles.mobileContent}>
                {/* Onglet Profil collé en haut */}
                <div className={styles.mobileTopTab}>
                    <button className={styles.btnTopTab} onClick={() => router.push('/profil')}>
                        <User size={16} />
                        Profil
                    </button>
                </div>

                <div className={styles.mobileLogo}>
                    <span className={styles.mobileLogoIcon}>💎</span>
                    <h1 className={styles.mobileLogoText}>League Of Stones</h1>
                </div>

                <button className={styles.btnLancerPartieMobile} onClick={handleLancerPartie}>
                    <span>▶</span>
                    Lancer une partie
                </button>
            </div>

            {/* ===== BOTTOM NAV MOBILE ===== */}
            <nav className={styles.bottomNav}>
                <button className={styles.bottomNavItem} onClick={handleModifierDeck}>
                    <Layers size={24} />
                    <span>Decks</span>
                </button>
                <button className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
                    <Home size={24} />
                    <span>Home</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => router.push('/lobby')}>
                    <Users size={24} />
                    <span>Social</span>
                </button>
            </nav>
        </>
    );
}