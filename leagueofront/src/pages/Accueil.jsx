import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Accueil.module.css';
import { useAuthStore } from '../store/authStore';
import { getAllPlayers, participate, getMatch } from '../services/api';
import { Layers, Home, User } from 'lucide-react';

export default function Accueil() {
    const router = useRouter();
    const { token, name } = useAuthStore();
    const [deckCards, setDeckCards] = useState([]);
    const [onlinePlayers, setOnlinePlayers] = useState([]);
    const [deckError, setDeckError] = useState('');

    // Overlay matchmaking
    const [isSearching, setIsSearching] = useState(false);

    // Overlay "match trouvé" — quand un adversaire a accepté un défi
    // alors qu'on était revenu sur l'accueil
    const [pendingMatch, setPendingMatch] = useState(false);

    // Redirection si pas connecté
    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token, router]);

    // Charger le deck + joueurs en ligne + vérifier si un match existe déjà
    useEffect(() => {
        if (!token) return;

        // Charger le deck sauvegardé
        const savedDeck = localStorage.getItem('myDeck_' + name);
        if (savedDeck) {
            try {
                setDeckCards(JSON.parse(savedDeck));
            } catch (e) {
                console.error("Erreur parsing deck:", e);
            }
        }

        // Récupérer joueurs en attente (juste pour l'affichage, pas d'inscription)
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

        // Vérifier si un match est en cours
        // Cas : le joueur était dans le matchmaking, est revenu sur l'accueil,
        // et entre-temps un adversaire a accepté son défi → match créé
        const checkExistingMatch = async () => {
            try {
                const matchData = await getMatch();
                if (matchData && matchData.player1 && matchData.player2) {
                    setPendingMatch(true);
                }
            } catch (err) {
                // Pas de match en cours, c'est normal
            }
        };

        fetchOnlinePlayers();
        checkExistingMatch();
    }, [token, name]);

    // Lancer une partie : overlay → participate() → redirection
    const handleLancerPartie = async () => {
        if (deckCards.length !== 20) {
            setDeckError("Votre deck doit contenir exactement 20 cartes (" + deckCards.length + "/20). Modifiez votre deck avant de lancer une partie.");
            return;
        }
        setIsSearching(true);
        try {
            await participate();
            setTimeout(() => {
                router.push('/matchmaking');
            }, 1500);
        } catch (err) {
            setIsSearching(false);
            console.error("Erreur matchmaking:", err);
        }
    };

    const handleCancel = () => {
        setIsSearching(false);
    };

    // Rejoindre le match en attente
    const handleJoinPendingMatch = () => {
        router.push('/game');
    };

    const handleModifierDeck = () => router.push('/deck');

    const renderDeckPreview = () => {
        const slots = [];
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
        for (let i = deckCards.length; i < 20; i++) {
            slots.push(
                <div key={'empty-' + i} className={styles.deckCardPlaceholder}>?</div>
            );
        }
        return slots;
    };

    return (
        <>
            {/* ===== OVERLAY : MATCH EN ATTENTE (quelqu'un a accepté le défi) ===== */}
            {pendingMatch && (
                <div className={styles.matchmakingOverlay}>
                    <div className={styles.matchmakingBox}>
                        <h2 className={styles.matchmakingTitle}>Match trouvé !</h2>
                        <p className={styles.matchmakingText}>Un adversaire a accepté votre défi</p>
                        <button className={styles.btnLancerPartie} onClick={handleJoinPendingMatch} style={{ marginTop: '15px' }}>
                            ⚔️ Rejoindre la partie
                        </button>
                    </div>
                </div>
            )}

            {/* ===== OVERLAY : RECHERCHE MATCHMAKING ===== */}
            {isSearching && (
                <div className={styles.matchmakingOverlay}>
                    <div className={styles.matchmakingBox}>
                        <div className={styles.spinner}></div>
                        <h2 className={styles.matchmakingTitle}>Matchmaking</h2>
                        <p className={styles.matchmakingText}>Recherche d'un adversaire...</p>
                        <button className={styles.btnCancel} onClick={handleCancel}>
                            ✕ Annuler
                        </button>
                    </div>
                </div>
            )}

            {deckError && (
                <div className={styles.matchmakingOverlay} onClick={() => setDeckError('')}>
                    <div className={styles.matchmakingBox} onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '3px solid #3b00b3' }}>
                        <h2 className={styles.matchmakingTitle} style={{ color: '#3b00b3' }}>⚠️ Deck incomplet</h2>
                        <p className={styles.matchmakingText} style={{ color: '#333', marginTop: '10px' }}>{deckError}</p>
                        <button className={styles.btnModifierDeck} onClick={() => { setDeckError(''); router.push('/deck'); }} style={{ marginTop: '20px' }}>
                            📋 Modifier le deck
                        </button>
                        <button className={styles.btnCancel} onClick={() => setDeckError('')} style={{ marginTop: '10px' }}>
                            ✕ Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* ===== NAVBAR DESKTOP ===== */}
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
                    <h2 className={styles.sectionTitle}>Joueurs en attente</h2>
                    <div className={styles.friendsContainer}>
                        {onlinePlayers.length > 0 ? (
                            <table className={styles.friendsTable}>
                                <thead>
                                    <tr>
                                        <th>Joueur</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {onlinePlayers.map((player, index) => (
                                        <tr key={index}>
                                            <td>🎮 {player.name}</td>
                                            <td>
                                                <button className={styles.btnInviter} onClick={handleLancerPartie}>
                                                    ⚔️ Rejoindre
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className={styles.noFriends}>Aucun joueur en attente...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== CONTENU MOBILE ===== */}
            <div className={styles.mobileContent}>
                <div className={styles.mobileTopTab}>
                    <button className={styles.btnTopTab} onClick={() => router.push('/profil')}>
                        <User size={16} />
                        Profil
                    </button>
                </div>

                <div className={styles.mobileLogo}>
                    <img src="/dragon.jpeg" alt="logo" style={{ width: '60px', height: '60px' }} />
                    <h1 className={styles.mobileLogoText}>League Of Stones</h1>
                </div>

                {/* Bouton contextuel : si match en attente, afficher "Rejoindre" à la place */}
                {pendingMatch ? (
                    <button className={styles.btnLancerPartieMobile} onClick={handleJoinPendingMatch}>
                        <span>⚔️</span>
                        Rejoindre la partie
                    </button>
                ) : (
                    <button className={styles.btnLancerPartieMobile} onClick={handleLancerPartie}>
                        <span>▶</span>
                        Lancer une partie
                    </button>
                )}
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
            </nav>
        </>
    );
}