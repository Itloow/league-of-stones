import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import styles from '../styles/Deck.module.css';
import { useAuthStore } from '../store/authStore';
import { getCards } from '../services/api';
import { Layers, Home, User } from 'lucide-react';

export default function Deck() {
    const router = useRouter();
    const { token } = useAuthStore();

    const [allCards, setAllCards] = useState([]);
    const [currentDeck, setCurrentDeck] = useState([]);
    const [savedDecks, setSavedDecks] = useState([null, null, null]);
    const [error, setError] = useState('');
    const [mobileEditing, setMobileEditing] = useState(false); // Toggle mobile : deck view / edit view

    useEffect(() => {
        if (!token) router.push('/');
    }, [token, router]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const result = await getCards();
                if (result && result.data) setAllCards(result.data);
                else if (result && Array.isArray(result)) setAllCards(result);
            } catch (err) {
                setError("Impossible de charger les cartes");
            }
        };
        if (token) fetchCards();

        const saved = localStorage.getItem('savedDecks');
        if (saved) { try { setSavedDecks(JSON.parse(saved)); } catch (e) {} }

        const activeDeck = localStorage.getItem('myDeck');
        if (activeDeck) { try { setCurrentDeck(JSON.parse(activeDeck)); } catch (e) {} }
    }, [token]);

    const handleAddToDeck = (card) => {
        if (currentDeck.length >= 20) { setError("Deck plein ! (max 20)"); return; }
        if (currentDeck.find(c => c.key === card.key)) { setError("Carte déjà dans le deck !"); return; }
        setError('');
        const newDeck = [...currentDeck, card];
        setCurrentDeck(newDeck);
        localStorage.setItem('myDeck', JSON.stringify(newDeck));
    };

    const handleRemoveFromDeck = (cardKey) => {
        const newDeck = currentDeck.filter(c => c.key !== cardKey);
        setCurrentDeck(newDeck);
        localStorage.setItem('myDeck', JSON.stringify(newDeck));
    };

    const handleSaveDeck = (slotIndex) => {
        if (currentDeck.length === 0) { setError("Deck vide !"); return; }
        const newSaved = [...savedDecks];
        newSaved[slotIndex] = [...currentDeck];
        setSavedDecks(newSaved);
        localStorage.setItem('savedDecks', JSON.stringify(newSaved));
        setError('');
    };

    const handleLoadDeck = (slotIndex) => {
        if (!savedDecks[slotIndex]) return;
        setCurrentDeck([...savedDecks[slotIndex]]);
        localStorage.setItem('myDeck', JSON.stringify(savedDecks[slotIndex]));
    };

    const handleDeleteDeck = (slotIndex) => {
        const newSaved = [...savedDecks];
        newSaved[slotIndex] = null;
        setSavedDecks(newSaved);
        localStorage.setItem('savedDecks', JSON.stringify(newSaved));
    };

    const getCardImage = (card) => {
        return 'https://ddragon.leagueoflegends.com/cdn/img/champion/loading/' + card.key + '_0.jpg';
    };

    const isInDeck = (cardKey) => currentDeck.some(c => c.key === cardKey);

    return (
        <>
            {/* ===== NAVBAR DESKTOP ===== */}
            <div className={styles.navbarDesktop}>
                <Navbar />
            </div>

            {/* ===== CONTENU DESKTOP — 3 colonnes (inchangé) ===== */}
            <div className={styles.pageContent}>
                {error && <div className={styles.errorMessage}>{error}</div>}

                {/* Collection */}
                <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>Ma Collection</h2>
                    <div className={styles.collectionContainer}>
                        <div className={styles.cardGrid}>
                            {allCards.map((card) => (
                                <div
                                    key={card.key}
                                    className={`${styles.cardWrapper} ${isInDeck(card.key) ? styles.cardDisabled : ''}`}
                                    onClick={() => !isInDeck(card.key) && handleAddToDeck(card)}
                                >
                                    <img src={getCardImage(card)} alt={card.name} className={styles.cardImage} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Deck actif */}
                <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>
                        Votre Deck <span className={styles.deckCount}>({currentDeck.length}/20)</span>
                    </h2>
                    <div className={styles.deckContainer}>
                        <div className={styles.cardGrid}>
                            {currentDeck.map((card) => (
                                <div key={card.key} className={styles.cardWrapper} onClick={() => handleRemoveFromDeck(card.key)}>
                                    <img src={getCardImage(card)} alt={card.name} className={styles.cardImage} />
                                    <div className={styles.removeOverlay}>✕</div>
                                </div>
                            ))}
                            {Array.from({ length: 20 - currentDeck.length }).map((_, i) => (
                                <div key={'empty-' + i} className={styles.deckPlaceholder}>?</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decks sauvegardés */}
                <div className={styles.column}>
                    <h2 className={styles.sectionTitle}>Mes Decks</h2>
                    <div className={styles.savedDecksContainer}>
                        {[0, 1, 2].map((slotIndex) => (
                            <div key={slotIndex} className={styles.savedDeckSlot}>
                                <div className={styles.savedDeckPreview}>
                                    {savedDecks[slotIndex] ? (
                                        <div className={styles.savedDeckMiniGrid}>
                                            {savedDecks[slotIndex].slice(0, 3).map((card) => (
                                                <img key={card.key} src={getCardImage(card)} alt={card.name} className={styles.miniCard} />
                                            ))}
                                        </div>
                                    ) : (
                                        <span className={styles.emptySlotText}>Vide</span>
                                    )}
                                </div>
                                <div className={styles.savedDeckInfo}>
                                    <span className={styles.savedDeckName}>Deck {slotIndex + 1}</span>
                                    <div className={styles.savedDeckActions}>
                                        <button className={styles.btnLoad} onClick={() => savedDecks[slotIndex] ? handleLoadDeck(slotIndex) : handleSaveDeck(slotIndex)}>📥</button>
                                        {savedDecks[slotIndex] && (
                                            <button className={styles.btnDelete} onClick={() => handleDeleteDeck(slotIndex)}>🗑️</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bouton retour desktop */}
            <div className={styles.bottomBarDesktop}>
                <button className={styles.btnRetour} onClick={() => router.push('/Accueil')}>
                    🏠 Retour au menu
                </button>
            </div>

            {/* ===== MOBILE — VUE DECK (écran 1) ===== */}
            <div className={`${styles.mobileView} ${mobileEditing ? styles.mobileHidden : ''}`}>
                <div className={styles.mobileLogo}>
                    <span className={styles.mobileLogoIcon}>💎</span>
                    <h1 className={styles.mobileTitle}>Decks</h1>
                </div>

                <div className={styles.mobileDeckGrid}>
                    {currentDeck.map((card, i) => (
                        <img key={i} src={getCardImage(card)} alt={card.name} className={styles.mobileCard} />
                    ))}
                    {Array.from({ length: Math.max(0, 9 - currentDeck.length) }).map((_, i) => (
                        <div key={'mp-' + i} className={styles.mobileCardPlaceholder}>?</div>
                    ))}
                </div>

                <button className={styles.btnMobileModifier} onClick={() => setMobileEditing(true)}>
                    📋 Modifier le deck
                </button>
            </div>

            {/* ===== MOBILE — VUE COLLECTION/EDIT (écran 2) ===== */}
            <div className={`${styles.mobileView} ${!mobileEditing ? styles.mobileHidden : ''}`}>
                <div className={styles.mobileLogo}>
                    <span className={styles.mobileLogoIcon}>💎</span>
                    <h1 className={styles.mobileTitle}>Collection</h1>
                </div>

                <h3 className={styles.mobileSubtitle}>Votre Deck ({currentDeck.length}/20)</h3>
                <div className={styles.mobileDeckGrid}>
                    {currentDeck.map((card) => (
                        <div key={card.key} className={styles.mobileCardWrapper} onClick={() => handleRemoveFromDeck(card.key)}>
                            <img src={getCardImage(card)} alt={card.name} className={styles.mobileCard} />
                        </div>
                    ))}
                    {Array.from({ length: Math.max(0, 6 - currentDeck.length) }).map((_, i) => (
                        <div key={'ep-' + i} className={styles.mobileCardPlaceholder}>?</div>
                    ))}
                </div>

                <h3 className={styles.mobileSubtitle}>Votre Collection</h3>
                <div className={styles.mobileDeckGrid}>
                    {allCards.map((card) => (
                        <div
                            key={card.key}
                            className={`${styles.mobileCardWrapper} ${isInDeck(card.key) ? styles.cardDisabled : ''}`}
                            onClick={() => !isInDeck(card.key) && handleAddToDeck(card)}
                        >
                            <img src={getCardImage(card)} alt={card.name} className={styles.mobileCard} />
                        </div>
                    ))}
                </div>

                <button className={styles.btnMobileSave} onClick={() => setMobileEditing(false)}>
                    📥 Sauvegarder
                </button>
            </div>

            {/* ===== BOTTOM NAV MOBILE ===== */}
            <nav className={styles.bottomNav}>
                <button className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}>
                    <Layers size={24} />
                    <span>Decks</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => router.push('/Accueil')}>
                    <Home size={24} />
                    <span>Home</span>
                </button>
                <button className={styles.bottomNavItem} onClick={() => router.push('/lobby')}>
                    <User size={24} />
                    <span>Profil</span>
                </button>
            </nav>
        </>
    );
}