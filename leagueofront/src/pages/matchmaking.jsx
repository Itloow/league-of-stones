import { useState, useEffect } from 'react';
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
    const [myMatchmakingId, setMyMatchmakingId] = useState(null);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Sécurité
    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // S'inscrire au matchmaking au montage
    const handleParticipate = async () => {
        try {
            const data = await participate();
            if (data) {
                setMyMatchmakingId(data.matchmakingId);
                if (data.request) setRequestsReceived(data.request);
            }
        } catch (err) {
            setError("Erreur matchmaking");
        }
    };

    // Récupérer la liste des joueurs en attente
    const fetchPlayers = async () => {
        try {
            const data = await getAllPlayers();
            // Le backend renvoie directement le tableau, donc on vérifie juste si c'est un Array !
            if (data && Array.isArray(data)) {
                setPlayersList(data);
            }
        } catch (err) {
            console.error("Erreur fetchPlayers :", err);
        }
    };

    // Rafraîchir les demandes
    const refreshRequests = async () => {
        try {
            const data = await participate();
            // Le backend renvoie directement l'objet avec la propriété request
            if (data && data.request) {
                setRequestsReceived(data.request);
            }
        } catch (err) {
            console.error("Erreur refreshRequests :", err);
        }
    };
    // Envoyer une demande de match
    const handleSendRequest = async (matchmakingId, playerName) => {
        try {
            await sendRequest(matchmakingId);
            setSuccessMsg('Défi envoyé à ' + playerName + ' !');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError("Erreur envoi défi");
        }
    };

    // Accepter une demande
    const handleAccept = async (matchmakingId) => {
        try {
            const data = await acceptRequest(matchmakingId);
            if (data) router.push('/game');
        } catch (err) {
            setError("Erreur acceptation");
        }
    };

    // Polling toutes les 5 secondes
    useEffect(() => {
        if (token) {
            // Fonction interne pour initialiser le matchmaking
            const initializeMatchmaking = async () => {
                await handleParticipate();
                await fetchPlayers();
            };

            initializeMatchmaking();

            const interval = setInterval(async () => {
                fetchPlayers();
                refreshRequests();
                // Ne pas rediriger automatiquement, attendre que l'utilisateur accepte
                try {
                    const data = await getMatch();
                    if (data) {
                        clearInterval(interval);
                        router.push('/game');
                    }
                } catch (err) { }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [token, router]);

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
                                <button className={styles.btnAccept} onClick={() => handleAccept(req.matchmakingId)}>
                                    ✅ Accepter
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.bottomButtons}>
                    <button className={styles.btnBack} onClick={() => router.push('/Accueil')}>
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
                    <button className={styles.btnMobileLaunch} onClick={() => handleAccept(requestsReceived[0].matchmakingId)}>
                        ▶ Lancer la partie
                    </button>
                )}

                <button className={styles.btnMobileRetour} onClick={() => router.push('/Accueil')}>
                    ← Retour
                </button>
            </div>

            {/* Bottom nav mobile */}
            <nav className={styles.bottomNav}>
                <button className={styles.bottomNavItem} onClick={() => router.push('/deck')}>
                    <Layers size={24} /><span>Decks</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => router.push('/Accueil')}>
                    <Home size={24} /><span>Home</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => router.push('/lobby')}>
                    <Users size={24} /><span>Social</span>
                </button>
            </nav>
        </>
    );
}