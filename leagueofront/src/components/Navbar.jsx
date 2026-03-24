import { Home, Layers, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
   const [activeTab, setActiveTab] = useState('ACCUEIL');
   const router = useRouter();

  const navItems = [
    { id: 'ACCUEIL', label: 'ACCUEIL', icon: Home },
    { id: 'DECKS', label: 'DECKS', icon: Layers },
    { id: 'SOCIAL', label: 'SOCIAL', icon: Users },
  ];
  
  return (
    <div className={styles.appContainer}>
      <nav className={styles.navbar}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <span className={styles.logoText}>
            LEAGUE OF STONES
          </span>
        </div>
        {/* Navigation Items */}
        <div className={styles.navLinks}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
              >
                <Icon size={20} className={isActive ? 'fill-current' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

         {/* Action Section */}
        <button 
          className={styles.loginButton}
          onClick={() => router.push('/login')}
        >
          CONNEXION
        </button>
      </nav>
    </div>  
  );
}