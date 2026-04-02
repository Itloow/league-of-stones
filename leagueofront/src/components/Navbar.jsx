import { Home, Layers } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';
import { useAuthStore } from '../store/authStore';
import { deconnexion } from '../services/api';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { token, name, logout } = useAuthStore();

  const getActiveTab = () => {
    const path = router.pathname;
    if (path === '/deck') return 'DECKS';
    return 'ACCUEIL';
  };

  const activeTab = getActiveTab();

  const handleLogout = async () => {
    await deconnexion();
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const navItems = [
    { id: 'ACCUEIL', label: 'ACCUEIL', icon: Home, route: '/Accueil' },
    { id: 'DECKS', label: 'DECKS', icon: Layers, route: '/deck' },
  ];

  const handleNavClick = (item) => {
    router.push(item.route);
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.navbar}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img src="/~olti.mjeku/webL3/out/dragon.jpeg" alt="logo" style={{ width: '52px', height: '52px', marginRight: '20px' }} />
          <span className={styles.logoText}>LEAGUE OF STONES</span>
        </div>

        {/* Navigation Items */}
        <div className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Section */}
        {token
          ? <div style={{ position: 'relative' }}>
            <button
              className={styles.loginButton}
              onClick={() => router.push('/profil')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <img
                src={(() => {
                  const deck = localStorage.getItem('myDeck_' + name);
                  if (deck) {
                    try {
                      const cards = JSON.parse(deck);
                      if (cards.length > 0) return 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' + cards[0].key + '_0.jpg';
                    } catch (e) { }
                  }
                  return 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg';
                })()}
                alt="avatar"
                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
              />
              {name}
            </button>
          </div>
          : <button
            className={styles.loginButton}
            onClick={() => router.push('/login')}
          >
            CONNEXION
          </button>
        }
      </nav>
    </div>
  );
}