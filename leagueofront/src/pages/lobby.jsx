import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Lobby.module.css';
import { useAuthStore } from '../store/authStore';
import { participate, getAllPlayers, sendRequest, acceptRequest, getMatch } from '../services/api';
import { Layers, Home, User } from 'lucide-react';

export default function Lobby() {
    const router = useRouter();
    const { token } = useAuthStore();

    // États du matchmaking
    const [isParticipating, setIsParticipating] = useState(false);
    const [playersList, setPlayersList] = useState([]);
    const [requestsReceived, setRequestsReceived] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Sécurité
    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // Rejoindre le matchmaking via api.js (tâche 18)
    const handleParticipate = async () => {
        try {
            const data = await participate();
            if (data) {
                setIsParticipating(true);
                if (data.request) setRequestsReceived(data.request);
            }
        } catch (err) {
            setError("Erreur lors de la participation au matchmaking");
        }
    };

    // Récupérer la liste des joueurs (tâche 19)
    const fetchPlayers = async () => {
        try {
            const data = await getAllPlayers();
            if (data && Array.isArray(data)) {
                setPlayersList(data);
            }
        } catch (err) {
            console.log("Erreur récupération joueurs");
        }
    };

    // Rafraîchir les demandes reçues via participate (qui renvoie le champ request)
    const refreshRequests = async () => {
        try {
            const data = await participate();
            if (data && data.request) {
                setRequestsReceived(data.request);
            }
        } catch (err) {
            console.log("Erreur rafraîchissement demandes");
        }
    };

    // Envoyer une demande de match (tâche 20)
    const handleSendRequest = async (matchmakingId, playerName) => {
        try {
            await sendRequest(matchmakingId);
            setSuccessMsg('Défi envoyé à ' + playerName + ' !');
            setError('');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setError("Erreur lors de l'envoi du défi");
        }
    };

    // Accepter une demande reçue (tâche 21)
    const handleAcceptRequest = async (matchmakingId) => {
        try {
            const data = await acceptRequest(matchmakingId);
            if (data) {
                router.push('/game');
            }
        } catch (err) {
            setError("Erreur lors de l'acceptation");
        }
    };

    // Vérifier si un match a commencé (tâche 22)
    const checkIfMatchStarted = async () => {
        try {
            const data = await getMatch();
            if (data) {
                router.push('/game');
            }
        } catch (err) {
            // Pas de match en cours, on continue le polling
        }
    };

    // Polling : rafraîchir toutes les 5 secondes (useEffect CM3 React II)
    useEffect(() => {
        let intervalId;

        if (isParticipating) {
            fetchPlayers();
            refreshRequests();
            checkIfMatchStarted();

            intervalId = setInterval(() => {
                fetchPlayers();
                refreshRequests();
                checkIfMatchStarted();
            }, 5000);
        }

        // Cleanup (CM3 React II : code de nettoyage du useEffect)
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isParticipating]);

    // Auto-participer au montage si token présent
    useEffect(() => {
        if (token) handleParticipate();
    }, [token]);

    return (
        <>
            {/* ===== NAVBAR DESKTOP ===== */}
            <div className={styles.navbarDesktop}>
                <Navbar />
            </div>

            {/* ===== CONTENU DESKTOP ===== */}
            <div className={styles.pageContent}>
                <div className={styles.socialHeader}>
                    <span className={styles.socialIcon}>💎</span>
                    <h1 className={styles.socialTitle}>Social</h1>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMsg && <div className={styles.successMessage}>{successMsg}</div>}

                <div className={styles.columnsWrapper}>
                    {/* Colonne gauche : Liste des joueurs en ligne */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Liste d'amis</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.friendsTable}>
                                <thead>
                                    <tr>
                                        <th>Pseudo</th>
                                        <th>Statut</th>
                                        <th>Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playersList.length > 0 ? (
                                        playersList.map((player, index) => (
                                            <tr key={player.matchmakingId || index}>
                                                <td className={styles.playerName}>{player.name}</td>
                                                <td>
                                                    <span className={styles.statusOnline}>
                                                        En ligne <span className={styles.dotGreen}>●</span>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.optionsButtons}>
                                                        <button
                                                            className={styles.btnInvite}
                                                            onClick={() => handleSendRequest(player.matchmakingId, player.name)}
                                                            title="Envoyer un défi"
                                                        >
                                                            ⚔️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className={styles.emptyText}>
                                                {isParticipating ? "Aucun joueur en ligne..." : "Connexion au matchmaking..."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Colonne droite : Défis reçus */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Défis reçus</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.friendsTable}>
                                <thead>
                                    <tr>
                                        <th>Joueur</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requestsReceived && requestsReceived.length > 0 ? (
                                        requestsReceived.map((req, index) => (
                                            <tr key={index}>
                                                <td className={styles.playerName}>🚨 {req.name}</td>
                                                <td>
                                                    <button
                                                        className={styles.btnAccept}
                                                        onClick={() => handleAcceptRequest(req.matchmakingId)}
                                                    >
                                                        ✅ Accepter
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className={styles.emptyText}>Aucun défi reçu</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Bouton retour */}
                <button className={styles.btnRetour} onClick={() => router.push('/Accueil')}>
                    🏠 Retour au menu
                </button>
            </div>

            {/* ===== MOBILE ===== */}
            <div className={styles.mobileContent}>
                <div className={styles.socialHeader}>
                    <span className={styles.socialIcon}>💎</span>
                    <h1 className={styles.socialTitle}>Social</h1>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMsg && <div className={styles.successMessage}>{successMsg}</div>}

                <h2 className={styles.mobileSectionTitle}>Liste d'amis</h2>
                <div className={styles.mobileTableContainer}>
                    <table className={styles.friendsTable}>
                        <thead>
                            <tr>
                                <th>Pseudo</th>
                                <th>Statut</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playersList.length > 0 ? (
                                playersList.map((player, index) => (
                                    <tr key={player.matchmakingId || index}>
                                        <td className={styles.playerName}>{player.name}</td>
                                        <td>
                                            <span className={styles.statusOnline}>
                                                En ligne <span className={styles.dotGreen}>●</span>
                                            </span>
                                        </td>
                                        <td>
                                            <button className={styles.btnInvite} onClick={() => handleSendRequest(player.matchmakingId, player.name)}>
                                                ⚔️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className={styles.emptyText}>Aucun joueur en ligne...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {requestsReceived && requestsReceived.length > 0 && (
                    <>
                        <h2 className={styles.mobileSectionTitle}>Défis reçus</h2>
                        <div className={styles.mobileTableContainer}>
                            <table className={styles.friendsTable}>
                                <tbody>
                                    {requestsReceived.map((req, index) => (
                                        <tr key={index}>
                                            <td className={styles.playerName}>🚨 {req.name}</td>
                                            <td>
                                                <button className={styles.btnAccept} onClick={() => handleAcceptRequest(req.matchmakingId)}>
                                                    ✅ Accepter
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* ===== BOTTOM NAV MOBILE ===== */}
            <nav className={styles.bottomNav}>
                <button className={styles.bottomNavItem} onClick={() => router.push('/deck')}>
                    <Layers size={24} />
                    <span>Decks</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => router.push('/Accueil')}>
                    <Home size={24} />
                    <span>Home</span>
                </button>
                <button className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
                    <User size={24} />
                    <span>Profil</span>
                </button>
            </nav>
        </>
    );
}