import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Lobby.module.css';
import { useAuthStore } from '../store/authStore';
import { getAllPlayers, participate } from '../services/api';
import { Layers, Home, User, Users } from 'lucide-react';

export default function Lobby() {
    const router = useRouter();
    const { token } = useAuthStore();

    const [playersList, setPlayersList] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requestsReceived, setRequestsReceived] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFriendName, setNewFriendName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // Charger les amis sauvegardés depuis localStorage
    useEffect(() => {
        const savedFriends = localStorage.getItem('friendsList');
        if (savedFriends) {
            try { setFriends(JSON.parse(savedFriends)); } catch (e) {}
        }
    }, []);

    // Récupérer les joueurs en ligne via matchmaking
    useEffect(() => {
        const fetchData = async () => {
            try {
                // On participe pour pouvoir voir la liste et recevoir des demandes
                const partData = await participate();
                if (partData && partData.request) setRequestsReceived(partData.request);

                const players = await getAllPlayers();
                if (players && Array.isArray(players)) setPlayersList(players);
            } catch (err) {
                console.log("Erreur récupération données social");
            }
        };

        if (token) {
            fetchData();
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, [token]);

    // Vérifier si un ami est en ligne (présent dans la liste matchmaking)
    const isOnline = (friendName) => {
        return playersList.some(p => p.name.toLowerCase() === friendName.toLowerCase());
    };

    // Ajouter un ami
    const handleAddFriend = () => {
        if (!newFriendName.trim()) return;
        if (friends.some(f => f.toLowerCase() === newFriendName.toLowerCase())) {
            setError("Cet ami est déjà dans ta liste !");
            return;
        }
        const newList = [...friends, newFriendName.trim()];
        setFriends(newList);
        localStorage.setItem('friendsList', JSON.stringify(newList));
        setNewFriendName('');
        setShowAddModal(false);
        setError('');
    };

    // Supprimer un ami
    const handleRemoveFriend = (friendName) => {
        const newList = friends.filter(f => f !== friendName);
        setFriends(newList);
        localStorage.setItem('friendsList', JSON.stringify(newList));
    };

    return (
        <>
            {/* ===== NAVBAR DESKTOP ===== */}
            <div className={styles.navbarDesktop}>
                <Navbar />
            </div>

            {/* ===== MODAL AJOUT AMI ===== */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Ajouter un ami</h3>
                        <input
                            type="text"
                            className={styles.modalInput}
                            placeholder="Pseudo du joueur..."
                            value={newFriendName}
                            onChange={(e) => setNewFriendName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                            autoFocus
                        />
                        {error && <p className={styles.modalError}>{error}</p>}
                        <div className={styles.modalButtons}>
                            <button className={styles.btnModalCancel} onClick={() => { setShowAddModal(false); setError(''); }}>
                                Annuler
                            </button>
                            <button className={styles.btnModalConfirm} onClick={handleAddFriend}>
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== CONTENU DESKTOP ===== */}
            <div className={styles.pageContent}>
                <div className={styles.socialHeader}>
                    <span className={styles.socialIcon}>💎</span>
                    <h1 className={styles.socialTitle}>Social</h1>
                </div>

                <div className={styles.columnsWrapper}>
                    {/* Colonne gauche : Liste d'amis */}
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
                                    {friends.length > 0 ? (
                                        friends.map((friend, index) => (
                                            <tr key={index}>
                                                <td className={styles.playerName}>{friend}</td>
                                                <td>
                                                    {isOnline(friend) ? (
                                                        <span className={styles.statusOnline}>En ligne <span className={styles.dotGreen}>●</span></span>
                                                    ) : (
                                                        <span className={styles.statusOffline}>Hors ligne <span className={styles.dotRed}>●</span></span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.optionsButtons}>
                                                        <button className={styles.btnDelete} onClick={() => handleRemoveFriend(friend)} title="Supprimer">
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className={styles.emptyText}>Aucun ami ajouté</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <button className={styles.btnAddFriend} onClick={() => setShowAddModal(true)}>
                            👤 Ajouter un ami
                        </button>
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
                                                    <button className={styles.btnAccept} onClick={() => router.push('/matchmaking')}>
                                                        ✅ Voir
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

                <button className={styles.btnRetour} onClick={() => router.push('/Accueil')}>
                    🏠 Retour au menu
                </button>
            </div>

            {/* ===== MOBILE ===== */}
            <div className={styles.mobileContent}>
                <div className={styles.mobileTopTab}>
                    <button className={styles.btnTopTabClose} onClick={() => router.push('/Accueil')}>
                        ✕ Fermer le menu
                    </button>
                </div>
                <div className={styles.socialHeader}>
                    <span className={styles.socialIcon}>💎</span>
                    <h1 className={styles.socialTitle}>Social</h1>
                </div>

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
                            {friends.length > 0 ? (
                                friends.map((friend, index) => (
                                    <tr key={index}>
                                        <td className={styles.playerName}>{friend}</td>
                                        <td>
                                            {isOnline(friend) ? (
                                                <span className={styles.statusOnline}>En ligne <span className={styles.dotGreen}>●</span></span>
                                            ) : (
                                                <span className={styles.statusOffline}>Hors ligne <span className={styles.dotRed}>●</span></span>
                                            )}
                                        </td>
                                        <td>
                                            <button className={styles.btnDelete} onClick={() => handleRemoveFriend(friend)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className={styles.emptyText}>Aucun ami ajouté</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <button className={styles.btnAddFriend} onClick={() => setShowAddModal(true)}>
                    👤 Ajouter un ami
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
                <button className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
                    <Users size={24} /><span>Social</span>
                </button>
            </nav>
        </>
    );
}