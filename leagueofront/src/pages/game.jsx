import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { initDeck, getMatch, pickCard, playCard, endTurn,attack, attackPlayer, finishMatch} from '../services/api';
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
    const [selectedAttackCard, setSelectedAttackCard] = useState(null);
    const [hasAttackedThisTurn, setHasAttackedThisTurn] = useState(false);
    const [attackMessage, setAttackMessage] = useState(null);
    const [matchFinished, setMatchFinished] = useState(false);

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
                console.log('getMatch retourne:', data); // DEBUG
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
    
     // Réinitialiser les flags d'attaque au changement de tour
   /*  useEffect(() => {
        if (!isMyTurn) {
            setSelectedAttackCard(null);
            setHasAttackedThisTurn(false);
        }
    }, [isMyTurn]);
 */
    const getCardImage = (key) => {
        return 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + key + '_0.jpg';
    };

    // Piocher une carte (une seule fois par tour)
    const handlePick = async () => {
        if (!isMyTurn) {
            setError('Ce n\'est pas votre tour');
            return;
        }
        
        if (matchData.cardPicked) {
            setError('Vous avez déjà pioché une carte ce tour');
            return;
        }

        try {
            const pickedCard = await pickCard();
            console.log('Carte piochée:', pickedCard);

            setTimeout(async () => {
                const updatedMatch = await getMatch();
                if (updatedMatch) setMatchData(updatedMatch);
            }, 100);
        } catch (err) {
            console.error('Erreur pioche:', err);
            setError('Erreur lors de la pioche');
        }
    };

    // Placer/remplacer une carte sur le tableau
    const handlePlayCard = async (cardKey) => {
        if (!isMyTurn) {
            setError('Ce n\'est pas votre tour');
            return;
        }

        try {
            await playCard(cardKey);
            console.log('Carte jouée:', cardKey);
            
            //  Refresh immédiat
            setTimeout(async () => {
                const updatedMatch = await getMatch();
                if (updatedMatch) setMatchData(updatedMatch);
            }, 500);
            
        } catch (err) {
            console.error('Erreur jeu:', err);
            setError('Erreur lors du jeu de la carte');
        }
    };

    // FONCTION PASSER LE TOUR
    const handleEndTurn = async () => {
        if (!isMyTurn) {
            setError('Ce n\'est pas votre tour');
            return;
        }

        try {
            
            await endTurn();
            
            // Refetch immédiat pour mise à jour rapide
            setTimeout(async () => {
                const updatedMatch = await getMatch();
                if (updatedMatch) setMatchData(updatedMatch);
            }, 100);
            
        } catch (err) {
            console.error('Erreur fin tour:', err);
            setError('Erreur lors de la fin du tour');
        }
    };
    // FONCTION ATTAQUER UNE CARTE ADVERSE
    const handleAttackCard = async (myCardKey, enemyCardKey) => {
        if (!isMyTurn) {
            setError('Ce n\'est pas votre tour');
            return;
        }
         if (hasAttackedThisTurn) {
            setError('Vous avez déjà attaqué ce tour');
            return;
        }

        try {
             setHasAttackedThisTurn(true);
             const myCardName = myPlayer.board.find(c => c.key === myCardKey)?.name || myCardKey;
            const enemyCardName = enemyPlayer.board.find(c => c.key === enemyCardKey)?.name || enemyCardKey;
            setAttackMessage(`${myCardName} attaque ${enemyCardName} !`);
             const result = await attack(myCardKey, enemyCardKey);
            console.log('Attaque carte:', result);
            setTimeout(() => {
              setAttackMessage(null);
            }, 2000);
         
            setTimeout(async () => {
                const updatedMatch = await getMatch();
                if (updatedMatch) setMatchData(updatedMatch);
            }, 200);
        } catch (err) {
            console.error('Erreur attaque:', err);
            setError('Erreur lors de l\'attaque');
        }
    };

    // FONCTION ATTAQUER LE JOUEUR DIRECTEMENT
    const handleAttackPlayer = async (myCardKey) => {
        if (!isMyTurn) {
            setError('Ce n\'est pas votre tour');
            return;
        }
         if (hasAttackedThisTurn) {
            setError('Vous avez déjà attaqué ce tour');
            return;
        }

        try {
             setHasAttackedThisTurn(true);
            const result = await attackPlayer(myCardKey);
            console.log('Attaque joueur:', result);
            setTimeout(async () => {
                const updatedMatch = await getMatch();
                if (updatedMatch) setMatchData(updatedMatch);
            }, 200);
        } catch (err) {
            console.error('Erreur attaque joueur:', err);
            setError('Erreur lors de l\'attaque au joueur');
        }
    };

    // Vérifier si le match est fini (HP <= 0)
    useEffect(() => {
        if (!matchData || !myPlayer || !enemyPlayer || matchFinished) return;
        
        if (myPlayer.hp <= 0 || enemyPlayer.hp <= 0) {
            const setFinishedTimer = setTimeout(() => {
                setMatchFinished(true); // Éviter les appels multiples
            }, 0);
            
            const timer = setTimeout(async () => {
                try {
                    await finishMatch();
                    router.push('/Accueil');
                } catch (err) {
                    console.error('Erreur finishMatch:', err);
                    router.push('/Accueil');
                }
            }, 3000);
                      
            return () => {
                clearTimeout(setFinishedTimer);
                clearTimeout(timer);
            };
        }
    }, [myPlayer?.hp, enemyPlayer?.hp, matchFinished]);

    // Réinitialiser matchFinished quand le match change
    useEffect(() => {
        const timer = setTimeout(() => {
            setMatchFinished(false);
        }, 0);
        return () => clearTimeout(timer);
    }, [matchData?._id]);

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

           {(error || (myPlayer.hp <= 0 || enemyPlayer.hp <= 0)) && (
                <div className={styles.errorMsg}>
                    {myPlayer.hp <= 0 || enemyPlayer.hp <= 0 
                        ? (myPlayer.hp > 0 ? 'Vous avez gagné ! 🎉' : 'Vous avez perdu ! 😢')
                        : error
                    }
                </div>
            )}
            {attackMessage && <div className={styles.attackMessageBox}>{attackMessage}</div>}

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
                        <img src={getCardImage(card.key)} 
                            alt={card.name || card.key} 
                            className={`${styles.handCardImg} ${isMyTurn && myPlayer.board && myPlayer.board.length > 0 ? styles.clickable : ''}`}
                            onClick={() => {
                                if (isMyTurn && selectedAttackCard) {
                                    handleAttackCard(selectedAttackCard, card.key);
                                    setSelectedAttackCard(null); // ✅ Réinitialiser après l'attaque
                                } else if (isMyTurn && !selectedAttackCard) {
                                    setError('Sélectionnez d\'abord une carte de votre board');
                                }
                            }}  
                            style={{ cursor: isMyTurn && myPlayer.board && myPlayer.board.length > 0 ? 'pointer' : 'default' }} />
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
                {matchData && (
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
                )}

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
                            <img 
                                src={getCardImage(card.key)} 
                                alt={card.name || card.key} 
                                className={`${styles.cardImg} ${isMyTurn && card.attack ? styles.clickable : ''} ${selectedAttackCard === card.key ? styles.selected : ''}`}
                                onClick={() => {
                                if (isMyTurn && card.attack) {
                                    if (selectedAttackCard !== null && selectedAttackCard !== card.key) {
                                        setError('Vous avez déjà choisi une carte ! Attaquez ou passez le tour.');
                                        return;
                                    }
                                    if (selectedAttackCard === card.key) {
                                        setSelectedAttackCard(null);  // Déselectionner
                                    } else {
                                        setSelectedAttackCard(card.key);  // Sélectionner
                                    }
                                } else if (isMyTurn && !card.attack) {
                                    setError('Cette carte vient d\'être jouée, elle ne peut pas attaquer ce tour');
                                }
                            }}
                                style={{ cursor: isMyTurn && card.attack ? 'pointer' : 'default' }}
                            />
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
            <div className={styles.handZoneWrapper}>
                {/* BOUTON PIOCHER - GAUCHE */}
                {isMyTurn && !matchData.cardPicked && typeof myPlayer.deck === 'number' && myPlayer.deck > 0 && (
                    <div
                        className={`${styles.handCard} ${styles.pickCard}`}
                        onClick={handlePick}
                    >
                        <div className={styles.pickCardContent}>
                            🃏
                        </div>
                        <div className={styles.handCardStats}>
                            <span className={styles.pickCardLabel}>PIOCHER</span>
                        </div>
                    </div>
                )}

                {/* MESSAGE DECK VIDE */}
                {isMyTurn && !matchData.cardPicked && typeof myPlayer.deck === 'number' && myPlayer.deck === 0 && (
                    <div
                        className={`${styles.handCard} ${styles.pickCard}`}
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    >
                        <div className={styles.pickCardContent}>
                            ⚠️
                        </div>
                        <div className={styles.handCardStats}>
                            <span className={styles.pickCardLabel}>DECK VIDE</span>
                        </div>
                    </div>
                )}

                {/* CARTES EN MAIN - MILIEU */}
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
                                <img 
                                    src={getCardImage(card.key)} 
                                    alt={card.name || card.key} 
                                    className={`${styles.handCardImg} ${isMyTurn ? styles.clickable : ''}`}
                                    onClick={() => isMyTurn && handlePlayCard(card.key)}
                                    style={{ cursor: isMyTurn ? 'pointer' : 'default' }}
                                />
                                <div className={styles.handCardStats}>
                                    <span className={styles.atkStat}>⚔️ {card.info ? card.info.attack : '?'}</span>
                                    <span className={styles.defStat}>🛡️ {card.info ? card.info.defense : '?'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOUTON PASSER - DROITE */}
                {isMyTurn && (
                    <div
                        className={`${styles.handCard} ${styles.passCard}`}
                        onClick={handleEndTurn}
                    >
                        <div className={styles.passCardContent}>
                            ⚡
                        </div>
                        <div className={styles.handCardStats}>
                            <span className={styles.passCardLabel}>PASSER</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
