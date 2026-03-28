import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { initDeck, getMatch } from '../services/api';
import Navbar from '@/components/Navbar';
import styles from '../styles/Game.module.css';

export default function Game() {
    const router = useRouter();
    const { token, name } = useAuthStore();

    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState('');
    const [deckSent, setDeckSent] = useState(false);
    const [loading, setLoading] = useState(true);

    const [myPlayer, setMyPlayer] = useState(null);
    const [enemyPlayer, setEnemyPlayer] = useState(null);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [enemyName, setEnemyName] = useState('Adversaire');

    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // Envoi du deck au serveur
    useEffect(() => {
        if (!token || deckSent) return;
        const sendDeck = async () => {
            try {
                const savedDeck = localStorage.getItem('myDeck_' + name);
                if (!savedDeck) { setError("Aucun deck sélectionné !"); setLoading(false); return; }
                const deck = JSON.parse(savedDeck);
                if (!deck || deck.length === 0) { setError("Votre deck est vide !"); setLoading(false); return; }
                await initDeck(deck);
                setDeckSent(true);
            } catch (err) {
                console.error("Erreur initDeck:", err);
            }
        };
        sendDeck();
    }, [token, name, deckSent]);

    // Polling getMatch toutes les 3 secondes
    useEffect(() => {
        if (!token) return;
        const fetchMatch = async () => {
            try {
                const data = await getMatch();
                if (!data) { setLoading(false); return; }
                setMatchData(data);
                setLoading(false);
                if (data.player1 && data.player2) {
                    if (Array.isArray(data.player1.hand)) {
                        setMyPlayer(data.player1);
                        setEnemyPlayer(data.player2);
                        setIsMyTurn(data.player1.turn === true);
                        setEnemyName(data.player2.name || 'Adversaire');
                    } else {
                        setMyPlayer(data.player2);
                        setEnemyPlayer(data.player1);
                        setIsMyTurn(data.player2.turn === true);
                        setEnemyName(data.player1.name || 'Adversaire');
                    }
                }
            } catch (err) {
                console.error("Erreur getMatch:", err);
            }
        };
        fetchMatch();
        const interval = setInterval(fetchMatch, 3000);
        return () => clearInterval(interval);
    }, [token]);

    const getCardImage = (key) => {
        return 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + key + '_0.jpg';
    };

    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.spinner}></div>
                <p>Chargement de la partie...</p>
            </div>
        );
    }

    if (!matchData || !myPlayer) {
        return (
            <div className={styles.loadingScreen}>
                <p>{error || "En attente de l'adversaire..."}</p>
                <div className={styles.spinner}></div>
                <button className={styles.btnRetour} onClick={() => router.push('/Accueil')}>
                    Retour au menu
                </button>
            </div>
        );
    }

    return (
        <div className={styles.gamePage}>
            <Navbar />

            {error && <div className={styles.errorMsg}>{error}</div>}

            {/* === PLATEAU PRINCIPAL === */}
            <div className={styles.boardContainer}>

                {/* --- ZONE ADVERSAIRE (haut) --- */}
                <div className={styles.enemySection}>
                    <div className={styles.deckInfo}>
                        Deck : {typeof enemyPlayer.deck === 'number' ? enemyPlayer.deck : '?'}
                    </div>

                    <div className={styles.slotsRow}>
                        {enemyPlayer && enemyPlayer.board && enemyPlayer.board.map((card) => (
                            <div key={card.key} className={styles.cardSlot}>
                                <img src={getCardImage(card.key)} alt={card.name || card.key} className={styles.cardImg} />
                                <div className={styles.cardStats}>
                                    <span className={styles.atkStat}>⚔️ {card.info ? card.info.attack : '?'}</span>
                                    <span className={styles.defStat}>🛡️ {card.info ? card.info.defense : '?'}</span>
                                </div>
                            </div>
                        ))}
                        {enemyPlayer && enemyPlayer.board && Array.from({ length: 5 - enemyPlayer.board.length }).map((_, i) => (
                            <div key={'ee-' + i} className={styles.emptySlot}></div>
                        ))}
                    </div>

                    <div className={styles.playerInfo}>
                        <div className={styles.avatarEnemy}>
                            <img
                                src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg"
                                alt="adversaire"
                                className={styles.avatarImg}
                            />
                        </div>
                        <span className={styles.playerName}>{enemyName}</span>
                        <span className={styles.hpText}>❤️ {enemyPlayer.hp}</span>
                    </div>
                </div>

                {/* --- SÉPARATEUR / TOUR --- */}
                <div className={styles.turnDivider}>
                    <span className={styles.turnText}>
                        {matchData.status === 'Deck is pending'
                            ? "En attente des decks..."
                            : isMyTurn
                                ? "A ton tour"
                                : "Tour adverse"
                        }
                    </span>
                </div>

                {/* --- ZONE JOUEUR (bas) --- */}
                <div className={styles.mySection}>
                    <div className={styles.playerInfo}>
                        <div className={styles.avatarMy}>
                            <img
                                src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg"
                                alt="moi"
                                className={styles.avatarImg}
                            />
                        </div>
                        <span className={styles.playerName}>{name || 'Moi'}</span>
                        <span className={styles.hpTextBlue}>❤️ {myPlayer.hp}</span>
                    </div>

                    <div className={styles.slotsRow}>
                        {myPlayer.board && myPlayer.board.map((card) => (
                            <div key={card.key} className={styles.cardSlot}>
                                <img src={getCardImage(card.key)} alt={card.name || card.key} className={styles.cardImg} />
                                <div className={styles.cardStats}>
                                    <span className={styles.atkStat}>⚔️ {card.info ? card.info.attack : '?'}</span>
                                    <span className={styles.defStat}>🛡️ {card.info ? card.info.defense : '?'}</span>
                                </div>
                            </div>
                        ))}
                        {myPlayer.board && Array.from({ length: 5 - myPlayer.board.length }).map((_, i) => (
                            <div key={'me-' + i} className={styles.emptySlot}></div>
                        ))}
                    </div>

                    <div className={styles.deckInfo}>
                        Deck : {typeof myPlayer.deck === 'number' ? myPlayer.deck : '?'}
                    </div>
                </div>
            </div>

            {/* === MAIN DU JOUEUR (en éventail) === */}
            <div className={styles.handZone}>
                {Array.isArray(myPlayer.hand) && myPlayer.hand.map((card, index) => {
                    const total = myPlayer.hand.length;
                    const middle = (total - 1) / 2;
                    const rotation = (index - middle) * 6;
                    const translateY = Math.abs(index - middle) * 8;

                    return (
                        <div
                            key={card.key}
                            className={styles.handCard}
                            style={{
                                transform: 'rotate(' + rotation + 'deg) translateY(' + translateY + 'px)',
                                zIndex: index,
                            }}
                        >
                            <img src={getCardImage(card.key)} alt={card.name || card.key} className={styles.handCardImg} />
                            <div className={styles.handCardStats}>
                                <span className={styles.atkStat}>⚔️ {card.info ? card.info.attack : '?'}</span>
                                <span className={styles.defStat}>🛡️ {card.info ? card.info.defense : '?'}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
