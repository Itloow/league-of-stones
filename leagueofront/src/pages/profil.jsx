import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Profil.module.css';
import { useAuthStore } from '../store/authStore';
import { deconnexion, unsubscribe } from '../services/api';
import { Layers, Home, User, Users } from 'lucide-react';

export default function Profil() {
    const router = useRouter();
    const { token, name, email, logout } = useAuthStore();
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    // Déconnexion
    const handleLogout = async () => {
        await deconnexion();
        logout();
        router.push('/');
    };

    // Suppression du compte (tâche 17)
    const handleDeleteAccount = async () => {
        try {
            alert("Fonctionnalité en cours de développement par Asmae");
            return;
            logout();
            router.push('/');
        } catch (err) {
            alert("Erreur lors de la suppression du compte");
        }
    };

    return (
        <>
            {/* Desktop : on affiche la navbar normale, le profil est dans le dropdown */}
            <div className={styles.navbarDesktop}>
                <Navbar />
                <div className={styles.desktopMessage}>
                    <p>Utilisez le menu en haut à droite pour gérer votre profil.</p>
                    <button className={styles.btnRetour} onClick={() => router.push('/Accueil')}>
                        🏠 Retour au menu
                    </button>
                </div>
            </div>

            {/* ===== MOBILE : Page Profil ===== */}
            <div className={styles.mobileContent}>
                {/* Onglet Social en haut */}
                <div className={styles.mobileTopTab}>
                    <button className={styles.btnTopTab} onClick={() => router.push('/lobby')}>
                        <Users size={16} />
                        Social
                    </button>
                </div>

                <div className={styles.profileHeader}>
                    <span className={styles.profileIcon}>💎</span>
                    <h1 className={styles.profileTitle}>Profil</h1>
                </div>

                <div className={styles.profileInfo}>
                    <p className={styles.userName}>{name || 'Joueur'}</p>
                    <p className={styles.userEmail}>{email || ''}</p>
                </div>

                <div className={styles.buttonsContainer}>
                    <button className={styles.btnModify}>
                        ⚙️ Modifier les informations
                    </button>
                    <button className={styles.btnDelete} onClick={() => setShowConfirm(true)}>
                        🗑️ Supprimer le compte
                    </button>
                    <button className={styles.btnLogout} onClick={handleLogout}>
                        🚪 Déconnexion
                    </button>
                </div>
            </div>

            {/* Modal de confirmation suppression */}
            {showConfirm && (
                <div className={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
                    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Supprimer le compte ?</h3>
                        <p className={styles.modalText}>Cette action est irréversible.</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.btnModalCancel} onClick={() => setShowConfirm(false)}>
                                Annuler
                            </button>
                            <button className={styles.btnModalConfirm} onClick={handleDeleteAccount}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
