import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Matchmaking.module.css';
import { useAuthStore } from '../store/authStore';
import { participate, getAllPlayers, sendRequest, acceptRequest, getMatch } from '../services/api';
import { Layers, Home, User, Users } from 'lucide-react';

export default function Matchmaking() {
    const router = useRouter();
    const { token, name } = useAuthStore();

    const [playersList, setPlayersList] = useState([]);
    const [requestsReceived, setRequestsReceived] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Refs pour gérer le cycle de vie du polling
    const hasRedirected = useRef(false);
    const intervalRef = useRef(null);

    // Sécurité : redirection si pas connecté
    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // ÉTAPE 1 : S'inscrire au matchmaking dès l'arrivée sur la page
    useEffect(() => {
        if (!token || isJoined) return;

        const joinMatchmaking = async () => {
            try {
                const data = await participate();
                if (data) {
                    setIsJoined(true);
                    if (data.request && Array.isArray(data.request)) {
                        setRequestsReceived(data.request);
                    }
                }
            } catch (err) {
                setError("Impossible de rejoindre le matchmaking");
            }
        };

        joinMatchmaking();
    }, [token, isJoined]);

    // ÉTAPE 2 : Polling régulier une fois inscrit
    useEffect(() => {
        if (!token || !isJoined) return;

        const poll = async () => {
            try {
                // Rafraîchir les demandes reçues
                const partData = await participate();
                if (partData && partData.request && Array.isArray(partData.request)) {
                    setRequestsReceived(partData.request);
                }

                // Récupérer la liste des joueurs en attente
                const players = await getAllPlayers();
                if (players && Array.isArray(players)) {
                    setPlayersList(players);
                }

                // Vérifier si un match a été créé (l'adversaire a accepté notre défi)
                if (!hasRedirected.current) {
                    const matchData = await getMatch();
                    if (matchData && matchData.player1 && matchData.player2) {
                        hasRedirected.current = true;
                        stopPolling();
                        router.push('/game');
                        return;
                    }
                }
            } catch (err) {
                console.log("Polling matchmaking:", err.message);
            }
        };

        // Premier poll immédiat
        poll();

        // Puis toutes les 5 secondes
        intervalRef.current = setInterval(poll, 5000);

        // Cleanup au démontage du composant (changement de page, etc.)
        return () => stopPolling();
    }, [token, isJoined, router]);

    // Fonction utilitaire pour stopper le polling proprement
    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // RETOUR : stopper le polling et quitter la page
    const handleLeave = () => {
        stopPolling();
        setIsJoined(false);
        router.push('/Accueil');
    };

    // Envoyer un défi à un joueur
    const handleSendRequest = async (matchmakingId, playerName) => {
        try {
            await sendRequest(matchmakingId);
            setSuccessMsg('Défi envoyé à ' + playerName + ' ! En attente de sa réponse...');
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            setError("Erreur lors de l'envoi du défi");
            setTimeout(() => setError(''), 3000);
        }
    };

    // Accepter un défi reçu → le match est créé côté backend
    const handleAccept = async (matchmakingId, playerName) => {
        try {
            const data = await acceptRequest(matchmakingId);
            if (data) {
                hasRedirected.current = true;
                stopPolling();
                router.push('/game');
            }
        } catch (err) {
            setError("Erreur lors de l'acceptation du défi");
            setTimeout(() => setError(''), 3000);
        }
    };

    // Effacer les messages d'erreur
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <>
            {/* Desktop navbar */}
            <div className={styles.navbarDesktop}>
                <Navbar />
            </div>

            {/* ===== CONTENU DESKTOP ===== */}
            <div className={styles.pageContent}>
                <div className={styles.header}>
                    <span className={styles.headerIcon}>💎</span>
                    <h1 className={styles.headerTitle}>Matchmaking</h1>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}
                {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

                {!isJoined ? (
                    <p style={{ color: '#26289F', fontWeight: 'bold' }}>Connexion au matchmaking...</p>
                ) : (
                    <>
                        <h2 className={styles.sectionTitle}>Liste d&#39;attente des joueurs</h2>

                        <div className={styles.tableContainer}>
                            <table className={styles.playersTable}>
                                <thead>
                                    <tr>
                                        <th>Pseudo</th>
                                        <th>Statut</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Moi en premier */}
                                    <tr className={styles.myRow}>
                                        <td className={styles.playerName}>🎮 {name || 'Moi'}</td>
                                        <td><span className={styles.statusReady}>Prêt <span className={styles.dotGreen}>●</span></span></td>
                                        <td className={styles.emptyCell}>—</td>
                                    </tr>

                                    {/* Séparateur VS */}
                                    {playersList.length > 0 && (
                                        <tr>
                                            <td colSpan="3" className={styles.vsRow}>
                                                <span className={styles.vsBadge}>VS</span>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Autres joueurs */}
                                    {playersList.length > 0 ? (
                                        playersList.map((player, index) => (
                                            <tr key={player.matchmakingId || index}>
                                                <td className={styles.playerName}>{player.name}</td>
                                                <td><span className={styles.statusWaiting}>En attente ⏳</span></td>
                                                <td>
                                                    <button className={styles.btnInvite} onClick={() => handleSendRequest(player.matchmakingId, player.name)}>
                                                        ⚔️ Défier
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className={styles.emptyText}>En attente d&#39;autres joueurs...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Défis reçus */}
                        {requestsReceived && requestsReceived.length > 0 && (
                            <div className={styles.requestsSection}>
                                <h3 className={styles.sectionTitle}>Défis reçus</h3>
                                {requestsReceived.map((req, i) => (
                                    <div key={i} className={styles.requestCard}>
                                        <span className={styles.playerName}>🚨 {req.name} veut jouer&#33;</span>
                                        <button className={styles.btnAccept} onClick={() => handleAccept(req.matchmakingId, req.name)}>
                                            ✅ Accepter
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <div className={styles.bottomButtons}>
                    <button className={styles.btnBack} onClick={handleLeave}>
                        ← Retour
                    </button>
                </div>
            </div>

            {/* ===== MOBILE ===== */}
            <div className={styles.mobileContent}>
                <div className={styles.mobileTopTab}>
                    <button className={styles.btnTopTab} onClick={() => router.push('/profil')}>
                        <User size={16} /> Profil
                    </button>
                </div>
                <div className={styles.header}>
                    <span className={styles.headerIcon}>💎</span>
                    <h1 className={styles.headerTitle}>Matchmaking</h1>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}
                {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

                {!isJoined ? (
                    <p style={{ color: '#26289F', fontWeight: 'bold', textAlign: 'center' }}>Connexion...</p>
                ) : (
                    <>
                        <h2 className={styles.mobileSectionTitle}>Liste d&#39;attente des joueurs</h2>

                        <div className={styles.mobileTableContainer}>
                            <table className={styles.playersTable}>
                                <thead>
                                    <tr>
                                        <th>Pseudo</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={styles.myRow}>
                                        <td className={styles.playerName}>🎮 {name || 'Moi'}</td>
                                        <td><span className={styles.statusReady}>Prêt <span className={styles.dotGreen}>●</span></span></td>
                                    </tr>
                                    {playersList.length > 0 && (
                                        <tr><td colSpan="2" className={styles.vsRow}><span className={styles.vsBadge}>VS</span></td></tr>
                                    )}
                                    {playersList.map((player, index) => (
                                        <tr key={player.matchmakingId || index}>
                                            <td className={styles.playerName}>{player.name}</td>
                                            <td><span className={styles.statusWaiting}>En attente ⏳</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {playersList.length > 0 && (
                            playersList.map((player, index) => (
                                <button key={player.matchmakingId || index} className={styles.btnMobileInvite} onClick={() => handleSendRequest(player.matchmakingId, player.name)}>
                                    ⚔️ Défier {player.name}
                                </button>
                            ))
                        )}

                        {requestsReceived && requestsReceived.length > 0 && (
                            <button className={styles.btnMobileLaunch} onClick={() => handleAccept(requestsReceived[0].matchmakingId, requestsReceived[0].name)}>
                                ▶ Accepter le défi de {requestsReceived[0].name}
                            </button>
                        )}
                    </>
                )}

                <button className={styles.btnMobileRetour} onClick={handleLeave}>
                    ← Retour
                </button>
            </div>

            {/* Bottom nav mobile */}
            <nav className={styles.bottomNav}>
                <button className={styles.bottomNavItem} onClick={() => { stopPolling(); router.push('/deck'); }}>
                    <Layers size={24} /><span>Decks</span>
                </button>
                <button className={styles.bottomNavItem} onClick={handleLeave}>
                    <Home size={24} /><span>Home</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => { stopPolling(); router.push('/lobby'); }}>
                    <Users size={24} /><span>Social</span>
                </button>
            </nav>
        </>
    );
}