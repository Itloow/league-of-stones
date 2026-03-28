import { initDeck } from "@/services/api";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import styles from "@/styles/Game.module.css";

export default function Game() {

    useEffect(() => {
    const setupMatch = async () => {
        // Récupérer le deck du joueur (depuis le localStorage ou authStore)
        const myDeck = JSON.parse(localStorage.getItem('selectedDeck'));
        
        // Initialiser le deck au serveur
        await initDeck(myDeck);
    };
    
    setupMatch();
}, []);

  return (
    <div className={styles['marble-bg']}>
       <Navbar />
    
      <h1>Game Page</h1>
      <p>Welcome to the game! Here you can play and have fun.</p>
    </div>
  );
}