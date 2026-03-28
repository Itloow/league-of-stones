import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, LogOut, Home, Layers, Users } from 'lucide-react';
import styles from '../styles/Profil.module.css';
import Navbar from "@/components/Navbar";
import { useAuthStore } from '../store/authStore';
import { deconnexion } from '../services/api';
import { updateProfil } from '../services/api';

export default function Profil() {
  const router = useRouter();
  const { email: authEmail, name: authName, password: authPassword, charger, logout } = useAuthStore();
  
  // Initialiser les states avec les données du store
  const [email, setEmail] = useState(authEmail || '');
  const [password, setPassword] = useState(authPassword || '');
  const [name, setName] = useState(authName || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Charger les données du store au montage uniquement
  useEffect(() => {
    charger();
  }, [charger]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

 

  const handleDeleteAccount = async () => {
    alert("Fonctionnalité en cours de développement");
    setShowConfirm(false);
  };
  const handleLogout = async () => {
    await deconnexion();
    logout();
    router.push('/');
  };
  const handleUpdateProfile = async () => {
    try {
      const data = await updateProfil(email, name, password);
      if (!data) {
        throw new Error('Aucune réponse du serveur');
      }
      alert("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (err) {
      alert(err.message || "Une erreur est survenue lors de la mise à jour du profil.");
    }
  };
  const handleUnsubscribe = async () => {
    alert("Fonctionnalité à venir");
  };

  return (
    <>
      <div className={styles.navbarWrapper}>
        <Navbar />
      </div>
      
      {/* VERSION WEB/DESKTOP */}
      <div className={styles.desktopContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>ADRESSE MAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.inputField} disabled={!isEditing} />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>MOT DE PASSE</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.inputField} placeholder="••••••••" disabled={!isEditing} />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>PSEUDO :</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.inputField} disabled={!isEditing} />
            </div>

            {!isEditing ? (
              <button type="button" className={styles.submitButton} onClick={() => setIsEditing(true)}>
                <Edit size={20} />
                MODIFIER LES INFORMATIONS
              </button>
            ) : (
              <>
                <button type="button" className={styles.submitButton} onClick={handleUpdateProfile}>
                  <Edit size={20} />
                  ENREGISTRER
                </button>
                <button type="button" className={styles.deleteButton} onClick={() => setIsEditing(false)}>
                  ANNULER
                </button>
              </>
            )}

            <div style={{ marginTop: '2px' }}></div>

            {!isEditing && (
              <button type="button" className={styles.deleteButton}>
                <Trash2 size={20} />
                SUPPRIMER LE COMPTE
              </button>
            )}
            <button type="button" className={styles.unsubscribeButton}  onClick={handleLogout}>
              <LogOut size={20} />
              DÉCONNEXION
            </button>

            <div style={{ marginTop: '2px', marginBottom: '10px' }}></div>

            <button type="button" className={styles.backButton} onClick={() => router.push('/Accueil')}>
              <Home size={20} />
              RETOUR AU MENU
            </button>
          </form>
        </div>
      </div>

      {/* VERSION MOBILE */}
      <div className={styles.mobileContainer}>
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

        {!isEditing ? (
          <>
            <div className={styles.profileInfo}>
              <p className={styles.userName}>{name || 'Joueur'}</p>
              <p className={styles.userEmail}>{email || ''}</p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.profileInfo}>
              <div className={styles.inputGroup} style={{ marginBottom: '15px' }}>
                <label className={styles.label}>ADRESSE MAIL</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.inputField} />
              </div>
              <div className={styles.inputGroup} style={{ marginBottom: '15px' }}>
                <label className={styles.label}>MOT DE PASSE</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.inputField} placeholder="••••••••" />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>PSEUDO</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.inputField} />
              </div>
            </div>
          </>
        )}

        <div className={styles.buttonsContainer}>
          {!isEditing ? (
            <>
              <button className={styles.btnModify} onClick={() => setIsEditing(true)}>
                <Edit size={18} />
                Modifier les informations
              </button>
              <button className={styles.btnDelete} onClick={() => setShowConfirm(true)}>
                <Trash2 size={18} />
                Supprimer le compte
              </button>
              <button className={styles.btnLogout} onClick={handleLogout}>
                <LogOut size={18} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button className={styles.btnModify} onClick={handleUpdateProfile}>
                <Edit size={18} />
                Enregistrer
              </button>
              <button className={styles.btnDelete} onClick={() => setIsEditing(false)}>
                Annuler
              </button>
            </>
          )}
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
      </div>
    </>
  );
}
