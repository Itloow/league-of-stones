import { useState, useEffect } from 'react'; // Hooks
import { useRouter } from 'next/router';

export default function Lobby() {
    const router = useRouter();

    // 1. Nos états locaux
    const [isParticipating, setIsParticipating] = useState(false);
    const [matchmakingId, setMatchmakingId] = useState(null);
    const [playersList, setPlayersList] = useState([]); // Liste des adversaires potentiels
    const [requestsReceived, setRequestsReceived] = useState([]); // Demandes de match reçues
    const [error, setError] = useState('');

    // Fonction utilitaire pour récupérer le token
    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    // 2. Fonction pour rejoindre le matchmaking (Tâche 18)
    const handleParticipate = async () => {
        const token = getToken();
        if (!token) {
            router.push('/login'); // Sécurité : on le renvoie au login s'il n'a pas de token
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/matchmaking/participate', {
                method: 'GET',
                headers: {
                    'www-authenticate': token, // Header exigé par l'API
                },
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Erreur lors de la participation');

            // Succès ! Le WS renvoie matchmakingId et le tableau request
            setIsParticipating(true);
            setMatchmakingId(data.matchmakingId);
            setRequestsReceived(data.request);

        } catch (err) {
            setError(err.message);
        }
    };

    // 3. Fonction pour récupérer la liste des joueurs (Tâche 19)
    const fetchPlayers = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/matchmaking/getAll', {
                method: 'GET',
                headers: {
                    'www-authenticate': token,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setPlayersList(data); // On met à jour notre état avec la liste des joueurs
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des joueurs:", err);
        }
    };

    // 4. Fonction pour envoyer une demande de match (Tâche 20)
    const handleSendRequest = async (targetId) => {
        const token = getToken();
        if (!token) return;

        try {
            // On passe l'ID de l'adversaire en paramètre d'URL
            const response = await fetch(`http://localhost:3000/matchmaking/request?matchmakingId=${targetId}`, {
                method: 'GET',
                headers: {
                    'www-authenticate': token,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'envoi de la requête');
            }

            alert('Défi envoyé avec succès ! En attente de sa réponse...');
        } catch (err) {
            setError(err.message);
        }
    };

    // 5. Fonction pour accepter une demande reçue (Tâche 21)
    const handleAcceptRequest = async (requesterId) => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/matchmaking/acceptRequest?matchmakingId=${requesterId}`, {
                method: 'GET',
                headers: {
                    'www-authenticate': token,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'acceptation');
            }

            // Si c'est un succès, le match est créé côté serveur !
            alert('Match accepté ! Préparation du plateau...');

            // On redirige vers la future page du plateau de jeu (Tâche 25 de Mohammed Ali)
            router.push('/match');

        } catch (err) {
            setError(err.message);
        }
    };

    // 6. Fonction pour la Tâche 22 : Vérifier si un match a commencé en arrière-plan
    const checkIfMatchStarted = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/match/getMatch', {
                method: 'GET',
                headers: {
                    'www-authenticate': token,
                },
            });

            // Si le statut est OK (200), le backend confirme qu'on est dans une partie !
            if (response.ok) {
                // On redirige automatiquement le joueur vers le plateau
                router.push('/match');
            }
        } catch (err) {
            // S'il n'y a pas de match, le serveur renvoie une erreur, on l'ignore silencieusement ici
            console.log("En attente d'un match...");
        }
    };

    // 7. Le Polling avec useEffect
    useEffect(() => {
        let intervalId;

        // On ne fait le polling QUE si le joueur participe
        if (isParticipating) {
            // Premier appel immédiat
            fetchPlayers();
            handleParticipate();
            checkIfMatchStarted(); // On vérifie tout de suite si un match a commencé

            // Mise en place de l'intervalle toutes les 5 secondes (5000ms)
            intervalId = setInterval(() => {
                fetchPlayers();
                handleParticipate();
                checkIfMatchStarted(); // On vérifie en boucle
            }, 5000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isParticipating]); // L'effet se déclenche quand isParticipating change

    // 5. Le rendu UI
    return (
        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Lobby - Matchmaking</h1>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            {!isParticipating ? (
                <button
                    onClick={handleParticipate}
                    style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Rejoindre le matchmaking
                </button>
            ) : (
                <div>
                    {/* ... info de participation ... */}

                    <div style={{ display: 'flex', gap: '20px' }}>

                        {/* Colonne Joueurs */}
                        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                            <h2>Joueurs en attente</h2>
                            {playersList.length === 0 ? (
                                <p>Aucun autre joueur pour le moment...</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {playersList.map((player) => (
                                        <li key={player.matchmakingId} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{player.name}</span>
                                            {/* On branche notre nouvelle fonction d'envoi de requête ici */}
                                            <button
                                                onClick={() => handleSendRequest(player.matchmakingId)}
                                                style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
                                            >
                                                Défier
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Colonne Demandes */}
                        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                            <h2>Défis reçus</h2>
                            {requestsReceived && requestsReceived.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {requestsReceived.map((req, index) => (
                                        <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>🚨 {req.name} veut jouer !</span>
                                            {/* On branche notre nouvelle fonction d'acceptation ici */}
                                            <button
                                                onClick={() => handleAcceptRequest(req.matchmakingId)}
                                                style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}
                                            >
                                                Accepter
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Aucun défi reçu.</p>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </main>
    );
}