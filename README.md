# 🐉 League of Stones

> Jeu de cartes en ligne — Mashup entre Hearthstone et League of Legends
> Projet Web L3 MIASHS — Université Toulouse 2 Jean Jaurès — Groupe 6

---

## 📋 Sommaire

1. [Présentation](#présentation)
2. [Équipe](#équipe)
3. [Technologies](#technologies)
4. [Prérequis](#prérequis)
5. [Lancement du backend](#lancement-du-backend)
6. [Lancement en local (développement)](#lancement-en-local-développement)
7. [Accès au site déployé](#accès-au-site-déployé)
8. [Structure du projet](#structure-du-projet)
9. [Guide complet d'utilisation](#guide-complet-dutilisation)
10. [Architecture API](#architecture-api)
11. [Dépôts Git](#dépôts-git)

---

## Présentation

League of Stones est un jeu de cartes en ligne au tour par tour. Deux joueurs s'affrontent avec un deck de **20 champions** issus de l'univers League of Legends et **150 points de vie** chacun. L'objectif est de réduire les points de vie de l'adversaire à 0.

**Règles de base :**
- Chaque joueur pioche 4 cartes au début de la partie
- À chaque tour, un joueur peut : piocher (1 fois), poser une carte sur le board (max 5), attaquer (1 fois par carte)
- Une carte posée ce tour ne peut attaquer qu'au tour suivant
- Si le board adverse est vide, on peut attaquer directement le joueur

---

## Équipe

| Membre | Rôle |
|---|---|
| **Olti MJEKU** | Gestion de projet |
| **Asmae ZALOUFI** | Responsable qualité |
| **Mohammed-Ali CHABANA** | Architecte |
| **Karim SAÏD** | Designer |
| **Hyacinthe WABOE** | Responsable mobile |

---

## Technologies

| Côté | Technologie |
|---|---|
| Frontend | React (Next.js), CSS Modules |
| État global | Zustand |
| Persistance locale | localStorage |
| Requêtes HTTP | fetch natif (async/await) |
| Backend | Express.js + MongoDB (fourni) |
| Icônes | Lucide React |
| Polices | Holtwood One SC, Poppins (Google Fonts) |

---

## Prérequis

- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur
- **MongoDB** installé et lancé sur votre machine

---

## Lancement du backend

> ⚠️ **Cette étape est obligatoire.** Sans le backend, aucune fonctionnalité du jeu ne fonctionne (connexion, cartes, matchmaking, partie).
```bash
# 1. Lancer MongoDB
mongod

# 2. Dans un nouveau terminal, aller dans le dossier backend
cd league-of-stones

# 3. Installer les dépendances (première fois uniquement)
npm install

# 4. Lancer le serveur
npm start
```

> Le serveur démarre sur **http://localhost:3001**. Vérifiez qu'il tourne avant de passer à la suite.

---

## Lancement en local (développement)

Dans un **nouveau terminal**, avec le backend qui tourne :
```bash
cd leagueofront

npm install

npm run dev
```

> L'application est accessible sur **http://localhost:3000**

---

## Accès au site déployé

Le frontend est déployé sur le serveur de la faculté :
```
http://mi-phpmut.univ-tlse2.fr/~olti.mjeku/webL3/out/
```

> ⚠️ **Important :** Le site déployé communique avec le backend via `http://localhost:3001`. Il faut donc :
> 1. Avoir **MongoDB lancé** sur votre machine
> 2. Avoir le **backend lancé** (`npm start` dans le dossier `league-of-stones`)
> 3. Accéder au site en **HTTP** (et non HTTPS) pour éviter le blocage des requêtes par le navigateur

---

## Structure du projet
```
src/
├── components/
│   └── Navbar.jsx              # Barre de navigation desktop
├── pages/
│   ├── _app.jsx                # Point d'entrée Next.js (overlay vert connecté)
│   ├── _document.jsx           # Document HTML racine
│   ├── index.jsx               # Redirige vers login ou accueil
│   ├── login.jsx               # Page de connexion
│   ├── register.jsx            # Page d'inscription
│   ├── success.jsx             # Confirmation création de compte
│   ├── Accueil.jsx             # Dashboard principal (deck + lancer partie)
│   ├── deck.jsx                # Gestion du deck (collection + sauvegarde)
│   ├── matchmaking.jsx         # Lobby d'attente et mise en relation
│   ├── game.jsx                # Plateau de jeu complet
│   ├── profil.jsx              # Profil utilisateur (déconnexion, suppression)
│   └── about.jsx               # Page à propos de l'équipe
├── services/
│   └── api.js                  # Toutes les fonctions fetch vers le backend
├── store/
│   └── authStore.js            # Store Zustand (token, name, email)
└── styles/
    ├── globals.css             # Styles globaux + fond + overlay vert
    ├── Navbar.module.css
    ├── Accueil.module.css
    ├── Deck.module.css
    ├── Game.module.css
    ├── Matchmaking.module.css
    ├── Profil.module.css
    ├── Login.module.css
    ├── Register.module.css
    ├── About.module.css
    └── Success.module.css
```

---

## Guide complet d'utilisation

### Étape 1 — Créer un compte

1. Ouvrir le site (local ou déployé)
2. Cliquer sur **INSCRIPTION**
3. Remplir le formulaire :
   - **Email** : doit se terminer par `@univ-tlse2.fr`
   - **Mot de passe** : au choix
   - **Confirmer le mot de passe** : identique
   - **Pseudo** : entre 3 et 28 caractères
4. Cliquer sur **SUIVANT →**
5. La page de confirmation s'affiche → cliquer sur **SUIVANT →** pour aller à la connexion

---

### Étape 2 — Se connecter

1. Entrer l'email et le mot de passe
2. Cliquer sur **CONNEXION**
3. Un overlay vert apparaît sur le fond (indicateur de session active)
4. Redirection automatique vers la page d'accueil

---

### Étape 3 — Construire son deck

> ⚠️ **Obligatoire avant de lancer une partie.** Le deck doit contenir exactement 20 cartes.

1. Depuis l'accueil, cliquer sur **📋 Modifier le deck** (ou onglet **DECKS** en mobile)
2. Dans **Ma Collection** (gauche), cliquer sur une carte pour l'ajouter au deck
3. Dans **Votre Deck** (centre), cliquer sur une carte pour la retirer
4. Répéter jusqu'à avoir **20/20 cartes**
5. Optionnel : sauvegarder le deck dans l'un des 3 emplacements (bouton 📥)
6. Retourner à l'accueil

---

### Étape 4 — Lancer une partie (Matchmaking)

> Les deux joueurs doivent avoir leur deck de 20 cartes prêt.

**Joueur A :**
1. Depuis l'accueil, cliquer sur **▶ Lancer une partie**
2. Redirection vers la page **Matchmaking**

**Joueur B :** faire la même chose sur un autre navigateur/compte.

**Dans le lobby :**
- La liste des joueurs se rafraîchit toutes les 5 secondes
- **Joueur A** clique sur **⚔️ Défier** face au nom de Joueur B
- **Joueur B** clique sur **✅ Accepter** dans la section Défis reçus
- Redirection automatique vers le plateau de jeu

---

### Étape 5 — Jouer la partie

#### Déroulement d'un tour

| Action | Comment faire |
|---|---|
| **Piocher** | Cliquer sur **🃏 PIOCHER** (1 fois par tour) |
| **Poser une carte** | Cliquer sur une carte dans votre main |
| **Attaquer un champion** | Cliquer sur votre carte (surlignée en doré) puis sur la carte adverse |
| **Attaquer le joueur** | Si board adverse vide : sélectionner votre carte puis cliquer sur **"Attaquer [nom]"** |
| **Finir le tour** | Cliquer sur **⚡ Fin du tour** ou la carte **PASSER** |

> **Restrictions :** une carte posée ce tour ne peut pas attaquer, chaque carte attaque 1 fois par tour, max 5 cartes sur le board, 1 pioche par tour.

#### Résolution des attaques

| Situation | Résultat |
|---|---|
| ATK > DEF adverse | Carte adverse détruite, différence retirée aux HP adverses |
| ATK = DEF | Les deux cartes détruites |
| ATK < DEF | Carte attaquante détruite |
| Board adverse vide | Attaque directe aux HP adverses |

---

### Étape 6 — Fin de partie

- Quand les HP d'un joueur tombent à 0, un overlay apparaît : 🏆 **Victoire** ou 💀 **Défaite**
- Cliquer sur **Retour à l'accueil**

> ⚠️ **Pour rejouer :** les deux joueurs doivent se déconnecter puis se reconnecter avant de lancer une nouvelle partie.

---

### Étape 7 — Gérer son profil

- **Déconnexion** : Profil → DÉCONNEXION
- **Suppression de compte** : Profil → SUPPRIMER LE COMPTE → saisir le mot de passe

---

## Architecture API

Toutes les requêtes après connexion incluent le token dans le header `WWW-Authenticate`.
```
PUT  /user                      → Créer un compte
POST /login                     → Se connecter
POST /logout                    → Se déconnecter
GET  /cards                     → Liste de toutes les cartes

GET  /matchmaking/participate   → Rejoindre la liste d'attente
GET  /matchmaking/getAll        → Lister les joueurs disponibles
GET  /matchmaking/request       → Envoyer un défi (?matchmakingId=...)
GET  /matchmaking/acceptRequest → Accepter un défi (?matchmakingId=...)

GET  /match/getMatch            → État complet du match (polling 3s)
GET  /match/initDeck            → Envoyer son deck (?deck=[...] encodé)
GET  /match/pickCard            → Piocher une carte
GET  /match/playCard            → Poser une carte (?card=key)
GET  /match/attack              → Attaquer un champion (?card=key&ennemyCard=key)
GET  /match/attackPlayer        → Attaquer le joueur (?card=key)
GET  /match/endTurn             → Finir le tour
GET  /match/finishMatch         → Clôturer le match terminé
```

---

## Dépôts Git

| Dépôt | URL |
|---|---|
| **GitLab (principal)** | https://mi-git.univ-tlse2.fr/olti.mjeku/leagueofstones.git |
| **GitHub (miroir)** | https://github.com/Itloow/league-of-stones.git |
