import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Trash2, LogOut, Home, Layers } from 'lucide-react';
import styles from '../styles/Profil.module.css';
import Navbar from "@/components/Navbar";
import { useAuthStore } from '../store/authStore';
import { deconnexion, unsubscribe } from '../services/api';

export default function Profil() {
  const router = useRouter();
  const { email: authEmail, name: authName, charger, logout } = useAuthStore();

  const [email, setEmail] = useState(authEmail || '');
  const [name, setName] = useState(authName || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    charger();
  }, [charger]);

  useEffect(() => {
    if (authEmail) setEmail(authEmail);
    if (authName) setName(authName);
  }, [authEmail, authName]);

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Veuillez entrer votre mot de passe");
      return;
    }

    try {
      await unsubscribe(email, deletePassword);
      logout();
      router.push('/');
    } catch (err) {
      setDeleteError("Mot de passe incorrect");
    }
  };

  const openDeleteModal = () => {
    setDeletePassword('');
    setDeleteError('');
    setShowConfirm(true);
  };

  const handleLogout = async () => {
    await deconnexion();
    logout();
    router.push('/');
  };

  return (
    <>
      <div className={styles.navbarWrapper}>
        <Navbar />
      </div>

      <div className={styles.desktopContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>ADRESSE MAIL</label>
              <input type="email" value={email} className={styles.inputField} disabled />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>PSEUDO :</label>
              <input type="text" value={name} className={styles.inputField} disabled />
            </div>

            <button type="button" className={styles.deleteButton} onClick={openDeleteModal}>
              <Trash2 size={20} />
              SUPPRIMER LE COMPTE
            </button>

            <button type="button" className={styles.unsubscribeButton} onClick={handleLogout}>
              <LogOut size={20} />
              DÉCONNEXION
            </button>

            <div style={{ marginTop: '2px', marginBottom: '10px' }}></div>

            <button type="button" className={styles.backButton} onClick={() => router.push('/Accueil')}>
              <Home size={20} />
              RETOUR AU MENU
            </button>
          </div>
        </div>
      </div>

      <div className={styles.mobileContainer}>
        <div className={styles.profileHeader}>
          <span className={styles.profileIcon}>💎</span>
          <h1 className={styles.profileTitle}>Profil</h1>
        </div>

        <div className={styles.profileInfo}>
          <p className={styles.userName}>{name || 'Joueur'}</p>
          <p className={styles.userEmail}>{email || ''}</p>
        </div>

        <div className={styles.buttonsContainer}>
          <button className={styles.btnDelete} onClick={openDeleteModal}>
            <Trash2 size={18} />
            Supprimer le compte
          </button>

          <button className={styles.btnLogout} onClick={handleLogout}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>

        <nav className={styles.bottomNav}>
          <button className={styles.bottomNavItem} onClick={() => router.push('/deck')}>
            <Layers size={24} />
            <span>Decks</span>
          </button>

          <button className={styles.bottomNavItem} onClick={() => router.push('/Accueil')}>
            <Home size={24} />
            <span>Home</span>
          </button>
        </nav>
      </div>

      {showConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Supprimer le compte ?</h3>
            <p className={styles.modalText}>
              Cette action est irréversible. Entrez votre mot de passe pour confirmer.
            </p>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Votre mot de passe"
              className={styles.modalInput}
            />

            {deleteError && <p className={styles.modalError}>{deleteError}</p>}

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
    </>
  );
}