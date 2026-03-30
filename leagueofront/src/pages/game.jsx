import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import { initDeck, getMatch, pickCard, playCard, endTurn, attack, attackPlayer, finishMatch } from '../services/api';
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
    const [attackMessage, setAttackMessage] = useState(null);
    const [matchFinished, setMatchFinished] = useState(false);

    // pour eviter les doubles clics sur les actions
    const [actionEnCours, setActionEnCours] = useState(false);

    // cartes jouees/attaquees ce tour (pour pas rejouer ou re-attaquer)
    const [playedThisTurn, setPlayedThisTurn] = useState([]);
    const [attackedThisTurn, setAttackedThisTurn] = useState([]);
    const [lastTurnState, setLastTurnState] = useState(false);

    // redirection si pas connecte
    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // envoi du deck au serveur au montage
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

    // recuperation des infos du match
    const refreshMatch = async () => {
        try {
            const data = await getMatch();
            if (!data) return;
            setMatchData(data);

            if (data.player1 && data.player2) {
                const amIPlayer1 = Array.isArray(data.player1.hand);
                const me = amIPlayer1 ? data.player1 : data.player2;
                const enemy = amIPlayer1 ? data.player2 : data.player1;

                setMyPlayer(me);
                setEnemyPlayer(enemy);
                setIsMyTurn(me.turn === true);
                setEnemyName(enemy.name || 'Adversaire');
            }
            setLoading(false);
        } catch (err) {
            console.error("Erreur refreshMatch:", err);
            setLoading(false);
        }
    };

    // polling toutes les 3 secondes
    useEffect(() => {
        if (!token) return;
        refreshMatch();
        const interval = setInterval(refreshMatch, 3000);
        return () => clearInterval(interval);
    }, [token]);

    // reset des listes quand le tour change
    useEffect(() => {
        if (isMyTurn && !lastTurnState) {
            setPlayedThisTurn([]);
            setAttackedThisTurn([]);
        }
        if (!isMyTurn) {
            setSelectedAttackCard(null);
        }
        setLastTurnState(isMyTurn);
    }, [isMyTurn]);

    const getCardImage = (key) => {
        return 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + key + '_0.jpg';
    };

    // piocher une carte
    const handlePick = async () => {
        if (actionEnCours) return;
        if (!isMyTurn) return setError('Ce n\'est pas votre tour');
        if (myPlayer.cardPicked) return setError('Vous avez déjà pioché une carte ce tour');

        setActionEnCours(true);
        try {
            await pickCard();
            setTimeout(refreshMatch, 100);
        } catch (err) {
            setError('Erreur lors de la pioche');
        } finally {
            setActionEnCours(false);
        }
    };

    // poser une carte sur le plateau
    const handlePlayCard = async (cardKey) => {
        if (actionEnCours) return;
        if (!isMyTurn) return setError('Ce n\'est pas votre tour');
        if (myPlayer.board && myPlayer.board.length >= 5) return setError('Plateau plein (5 max)');

        setActionEnCours(true);
        try {
            setPlayedThisTurn(prev => [...prev, cardKey]);
            await playCard(cardKey);
            setTimeout(refreshMatch, 200);
        } catch (err) {
            setError('Erreur lors du jeu de la carte');
        } finally {
            setActionEnCours(false);
        }
    };

    // fin du tour
    const handleEndTurn = async () => {
        if (actionEnCours) return;
        if (!isMyTurn) return setError('Ce n\'est pas votre tour');

        setActionEnCours(true);
        try {
            await endTurn();
            setSelectedAttackCard(null);
            setTimeout(refreshMatch, 100);
        } catch (err) {
            setError('Erreur lors de la fin du tour');
        } finally {
            setActionEnCours(false);
        }
    };

    // attaquer une carte adverse
    const handleAttackCard = async (myCardKey, enemyCardKey) => {
        if (actionEnCours) return;
        if (!isMyTurn) return setError('Ce n\'est pas votre tour');

        if (playedThisTurn.includes(myCardKey)) return setError('Cette carte vient d\'être posée, elle doit attendre !');
        if (attackedThisTurn.includes(myCardKey)) return setError('Cette carte a déjà attaqué ce tour !');

        const myCard = myPlayer.board.find(c => c.key === myCardKey);
        if (!myCard || myCard.attack) return setError('Cette carte ne peut plus attaquer.');

        setActionEnCours(true);
        try {
            setAttackedThisTurn(prev => [...prev, myCardKey]);
            setSelectedAttackCard(null);

            const myCardName = myCard.name || myCardKey;
            const enemyCardName = enemyPlayer.board.find(c => c.key === enemyCardKey)?.name || enemyCardKey;
            setAttackMessage(myCardName + ' attaque ' + enemyCardName + ' !');

            await attack(myCardKey, enemyCardKey);

            setTimeout(() => setAttackMessage(null), 2000);
            setTimeout(refreshMatch, 200);
        } catch (err) {
            setError('Erreur lors de l\'attaque');
        } finally {
            setActionEnCours(false);
        }
    };

    // attaquer directement le joueur adverse (board vide)
    const handleAttackPlayer = async (myCardKey) => {
        if (actionEnCours) return;
        if (!isMyTurn) return setError('Ce n\'est pas votre tour');
        if (enemyPlayer.board && enemyPlayer.board.length > 0) return setError('Le board adverse n\'est pas vide !');

        if (playedThisTurn.includes(myCardKey)) return setError('Cette carte vient d\'être posée, elle doit attendre !');
        if (attackedThisTurn.includes(myCardKey)) return setError('Cette carte a déjà attaqué ce tour !');

        const myCard = myPlayer.board.find(c => c.key === myCardKey);
        if (!myCard || myCard.attack) return setError('Cette carte ne peut plus attaquer.');

        setActionEnCours(true);
        try {
            setAttackedThisTurn(prev => [...prev, myCardKey]);
            setSelectedAttackCard(null);

            const myCardName = myCard.name || myCardKey;
            setAttackMessage(myCardName + ' attaque ' + enemyName + ' directement !');

            await attackPlayer(myCardKey);

            setTimeout(() => setAttackMessage(null), 2000);
            setTimeout(refreshMatch, 200);
        } catch (err) {
            setError('Erreur lors de l\'attaque au joueur');
        } finally {
            setActionEnCours(false);
        }
    };

    // gestion de la fin de match (hp a 0)
    useEffect(() => {
        if (!matchData || !myPlayer || !enemyPlayer || matchFinished) return;

        if (myPlayer.hp <= 0 || enemyPlayer.hp <= 0) {
            setMatchFinished(true);
            const timer = setTimeout(async () => {
                try {
                    await finishMatch();
                    router.push('/Accueil');
                } catch (err) {
                    router.push('/Accueil');
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [myPlayer?.hp, enemyPlayer?.hp, matchFinished]);

    // reset du flag matchFinished si on change de match
    useEffect(() => {
        setMatchFinished(false);
    }, [matchData?._id]);

    // efface le message d'erreur apres 3 secondes
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // verifier si une carte peut attaquer
    const canCardAttack = (card) => {
        return isMyTurn && !playedThisTurn.includes(card.key) && !attackedThisTurn.includes(card.key) && !card.attack;
    };

    if (loading) return <div className={styles.loadingScreen}><div className={styles.spinner}></div><p>Chargement...</p></div>;
    if (!matchData || !myPlayer) return <div className={styles.loadingScreen}><p>{error || "En attente..."}</p><button className={styles.btnRetour} onClick={() => router.push('/Accueil')}>Retour</button></div>;

    return (
        <div className={styles.gamePage}>
            <Navbar />

            {(error || (myPlayer.hp <= 0 || enemyPlayer.hp <= 0)) && (
                <div className={styles.errorMsg}>
                    {myPlayer.hp <= 0 || enemyPlayer.hp <= 0 ? (myPlayer.hp > 0 ? 'Vous avez gagné !' : 'Vous avez perdu !') : error}
                </div>
            )}
            {attackMessage && <div className={styles.attackMessageBox}>{attackMessage}</div>}

            <div className={styles.boardContainer}>
                {/* zone adversaire */}
                <div className={styles.enemySection}>
                    <div className={styles.deckInfo}>Deck : {typeof enemyPlayer.deck === 'number' ? enemyPlayer.deck : '?'}</div>
                    <div className={styles.slotsRow}>
                        {enemyPlayer.board && enemyPlayer.board.map((card) => (
                            <div key={card.key} className={styles.cardSlot}>
                                <img src={getCardImage(card.key)} alt={card.name}
                                    className={`${styles.handCardImg} ${isMyTurn && myPlayer.board?.length > 0 ? styles.clickable : ''}`}
                                    onClick={() => {
                                        if (isMyTurn && selectedAttackCard) handleAttackCard(selectedAttackCard, card.key);
                                        else if (isMyTurn) setError("Sélectionnez d'abord votre carte");
                                    }}
                                    style={{ cursor: isMyTurn && myPlayer.board?.length > 0 ? 'pointer' : 'default' }} />
                                <div className={styles.cardStats}>
                                    <span className={styles.atkStat}>⚔️ {card.info?.attack || '?'}</span>
                                    <span className={styles.defStat}>🛡️ {card.info?.defense || '?'}</span>
                                </div>
                            </div>
                        ))}
                        {enemyPlayer.board && Array.from({ length: 5 - (enemyPlayer.board.length || 0) }).map((_, i) => <div key={'ee-' + i} className={styles.emptySlot}></div>)}
                    </div>

                    <div className={styles.playerInfo}>
                        <div className={styles.avatarEnemy}><img src="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Garen_0.jpg" alt="adversaire" className={styles.avatarImg} /></div>
                        <span className={styles.playerName}>{enemyName}</span>
                        <span className={styles.hpText}>❤️ {enemyPlayer.hp}</span>
                        {isMyTurn && selectedAttackCard && (!enemyPlayer.board || enemyPlayer.board.length === 0) && (
                            <button className={styles.btnAttackPlayer} onClick={() => handleAttackPlayer(selectedAttackCard)}>
                                Attaquer {enemyName}
                            </button>
                        )}
                    </div>
                </div>

                {matchData && (
                    <div className={styles.turnDivider}>
                        <span className={styles.turnText}>{matchData.status === 'Deck is pending' ? "Attente des decks..." : isMyTurn ? "A ton tour" : "Tour adverse"}</span>
                    </div>
                )}

                {/* zone joueur */}
                <div className={styles.mySection}>
                    <div className={styles.playerInfo}>
                        <div className={styles.avatarMy}><img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg" alt="moi" className={styles.avatarImg} /></div>
                        <span className={styles.playerName}>{name || 'Moi'}</span>
                        <span className={styles.hpTextBlue}>❤️ {myPlayer.hp}</span>
                    </div>

                    <div className={styles.slotsRow}>
                        {myPlayer.board && myPlayer.board.map((card) => {
                            const isClickable = canCardAttack(card);
                            return (
                                <div key={card.key} className={styles.cardSlot}>
                                    <img src={getCardImage(card.key)} alt={card.name}
                                        className={`${styles.cardImg} ${isClickable ? styles.clickable : ''} ${selectedAttackCard === card.key ? styles.selected : ''}`}
                                        onClick={() => {
                                            if (isClickable) setSelectedAttackCard(selectedAttackCard === card.key ? null : card.key);
                                            else if (isMyTurn) setError('Cette carte ne peut pas attaquer !');
                                        }}
                                        style={{ cursor: isClickable ? 'pointer' : 'default' }} />
                                    <div className={styles.cardStats}>
                                        <span className={styles.atkStat}>⚔️ {card.info?.attack || '?'}</span>
                                        <span className={styles.defStat}>🛡️ {card.info?.defense || '?'}</span>
                                    </div>
                                </div>
                            );
                        })}
                        {myPlayer.board && Array.from({ length: 5 - (myPlayer.board.length || 0) }).map((_, i) => <div key={'me-' + i} className={styles.emptySlot}></div>)}
                    </div>
                    <div className={styles.deckInfo}>Deck : {typeof myPlayer.deck === 'number' ? myPlayer.deck : '?'}</div>
                </div>
            </div>

            {/* main du joueur */}
            <div className={styles.handZoneWrapper}>
                {isMyTurn && !myPlayer.cardPicked && myPlayer.deck > 0 && (
                    <div className={`${styles.handCard} ${styles.pickCard}`} onClick={handlePick}>
                        <div className={styles.pickCardContent}>🃏</div>
                        <div className={styles.handCardStats}><span className={styles.pickCardLabel}>PIOCHER</span></div>
                    </div>
                )}
                {isMyTurn && !myPlayer.cardPicked && myPlayer.deck === 0 && (
                    <div className={`${styles.handCard} ${styles.pickCard}`} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                        <div className={styles.pickCardContent}>⚠️</div>
                        <div className={styles.handCardStats}><span className={styles.pickCardLabel}>DECK VIDE</span></div>
                    </div>
                )}

                <div className={styles.handZone}>
                    {Array.isArray(myPlayer.hand) && myPlayer.hand.map((card, index) => {
                        const middle = (myPlayer.hand.length - 1) / 2;
                        return (
                            <div key={card.key} className={styles.handCard} style={{ transform: 'rotate(' + (index - middle) * 6 + 'deg) translateY(' + Math.abs(index - middle) * 8 + 'px)', zIndex: index }}>
                                <img src={getCardImage(card.key)} alt={card.name} className={`${styles.handCardImg} ${isMyTurn && (!myPlayer.board || myPlayer.board.length < 5) ? styles.clickable : ''}`}
                                    onClick={() => isMyTurn && handlePlayCard(card.key)} style={{ cursor: isMyTurn && (!myPlayer.board || myPlayer.board.length < 5) ? 'pointer' : 'default' }} />
                                <div className={styles.handCardStats}>
                                    <span className={styles.atkStat}>⚔️ {card.info?.attack || '?'}</span>
                                    <span className={styles.defStat}>🛡️ {card.info?.defense || '?'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isMyTurn && (
                    <div className={`${styles.handCard} ${styles.passCard}`} onClick={handleEndTurn}>
                        <div className={styles.passCardContent}>⚡</div>
                        <div className={styles.handCardStats}><span className={styles.passCardLabel}>PASSER</span></div>
                    </div>
                )}
            </div>
        </div>
    );
}
