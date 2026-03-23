const API_URL = "http://localhost:3001";

function getToken() {
    return localStorage.getItem("token");
}

// ===== USERS =====

export const inscription = async (email, name, password) => {
    try {
        const reponse = await fetch(API_URL + "/user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, password }),
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de créer le compte : ${error}`);
    }
};

export const connexion = async (email, password) => {
    try {
        const reponse = await fetch(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de se connecter : ${error}`);
    }
};

export const deconnexion = async () => {
    try {
        const reponse = await fetch(API_URL + "/logout", {
            method: "POST",
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de se déconnecter : ${error}`);
    }
};

export const amIConnected = async () => {
    try {
        const reponse = await fetch(API_URL + "/users/amIConnected", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de vérifier la connexion : ${error}`);
    }
};

// ===== CARDS =====

export const getCards = async () => {
    try {
        const reponse = await fetch(API_URL + "/cards");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de récupérer les cartes : ${error}`);
    }
};

// ===== MATCHMAKING =====

export const participate = async () => {
    try {
        const reponse = await fetch(API_URL + "/matchmaking/participate", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de participer au matchmaking : ${error}`);
    }
};

export const getAllPlayers = async () => {
    try {
        const reponse = await fetch(API_URL + "/matchmaking/getAll", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de récupérer les joueurs : ${error}`);
    }
};

export const sendRequest = async (matchmakingId) => {
    try {
        const reponse = await fetch(API_URL + "/matchmaking/request?matchmakingId=" + matchmakingId, {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible d'envoyer la demande : ${error}`);
    }
};

export const acceptRequest = async (matchmakingId) => {
    try {
        const reponse = await fetch(API_URL + "/matchmaking/acceptRequest?matchmakingId=" + matchmakingId, {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible d'accepter la demande : ${error}`);
    }
};

// ===== MATCH =====

export const getMatch = async () => {
    try {
        const reponse = await fetch(API_URL + "/match/getMatch", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de récupérer le match : ${error}`);
    }
};

export const initDeck = async (deck) => {
    try {
        const encoded = encodeURIComponent(JSON.stringify(deck));
        const reponse = await fetch(API_URL + "/match/initDeck?deck=" + encoded, {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible d'initialiser le deck : ${error}`);
    }
};

export const pickCard = async () => {
    try {
        const reponse = await fetch(API_URL + "/match/pickCard", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de piocher une carte : ${error}`);
    }
};

export const playCard = async (cardKey) => {
    try {
        const reponse = await fetch(API_URL + "/match/playCard?card=" + cardKey, {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de jouer la carte : ${error}`);
    }
};

export const attack = async (card, ennemyCard) => {
    try {
        const reponse = await fetch(API_URL + "/match/attack?card=" + card + "&ennemyCard=" + ennemyCard, {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible d'attaquer : ${error}`);
    }
};

export const attackPlayer = async (card) => {
    try {
        const reponse = await fetch(API_URL + "/match/attackPlayer?card=" + card, {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible d'attaquer le joueur : ${error}`);
    }
};

export const endTurn = async () => {
    try {
        const reponse = await fetch(API_URL + "/match/endTurn", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de terminer le tour : ${error}`);
    }
};

export const finishMatch = async () => {
    try {
        const reponse = await fetch(API_URL + "/match/finishMatch", {
            headers: {
                "WWW-Authenticate": getToken(),
            },
        });
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const json = await reponse.json();
        return json;
    } catch (error) {
        console.error(`Impossible de terminer le match : ${error}`);
    }
};