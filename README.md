## 🚀 Comment lancer le projet en local

Ce projet est "Full-Stack". Il faut donc ouvrir **deux terminaux séparés** pour faire tourner le serveur (Backend) et l'interface (Frontend) en même temps.

### 1. Lancer le Serveur (Backend)

Ouvrez un premier terminal et placez-vous dans le dossier principal du serveur :
```bash 
cd league-of-stones
```
Installez les dépendances (nécessaire uniquement la première fois) :
```bash
npm install
```

Démarrez le serveur :
```bash 
node app.js
```
> Le serveur est prêt lorsqu'il affiche "MONGO DB initialised" et tourne sur le port 3001. Ne fermez pas ce terminal.

---

### 2. Lancer l'Interface (Frontend)

Ouvrez un deuxième terminal et placez-vous dans le dossier de l'interface React :
```bash
cd leagueofront
```
Installez les dépendances (nécessaire uniquement la première fois) :
```bash
npm install
```
Démarrez le site :
```bash
npm run dev
```
> Le frontend est prêt lorsqu'il indique "Ready" et tourne sur le port 3000.

---

### 3. Accéder au jeu

Ouvrez votre navigateur web et accédez à l'adresse suivante :
http://localhost:3000

Pour tout arrêter, faites `Ctrl + C` dans chacun de vos deux terminaux.





# 🐉 League of Stones

> Jeu de cartes en ligne — Mashup entre Hearthstone et League of Legends  
> Projet Web L3 MIASHS — Université Toulouse 2 Jean Jaurès — Groupe 6

---

## 📋 Sommaire

1. [Présentation](#présentation)
2. [Équipe](#équipe)
3. [Technologies](#technologies)
4. [Prérequis](#prérequis)
5. [Installation et lancement](#installation-et-lancement)
6. [Structure du projet](#structure-du-projet)
7. [Guide complet d'utilisation](#guide-complet-dutilisation)
8. [Architecture API](#architecture-api)
9. [Dépôts Git](#dépôts-git)

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
- **MongoDB** (pour le backend)
- Le dossier backend `league-of-stones/` (fourni par le professeur)

---

## Installation et lancement

### 1. Lancer le backend (serveur du professeur)

```bash
# Aller dans le dossier backend
cd league-of-stones

# Installer les dépendances (première fois uniquement)
npm install

# Lancer le serveur
npm start
```

> Le serveur démarre sur **http://localhost:3001**  
> Vérifier que MongoDB est bien lancé avant cette étape.

---

### 2. Lancer le frontend (client React)

Dans un **nouveau terminal** :

```bash
# Aller dans le dossier du client
cd client   # ou le dossier contenant src/

# Installer les dépendances (première fois uniquement)
npm install

# Lancer l'application en développement
npm run dev
```

> L'application est accessible sur **http://localhost:3000**

---

### 3. Vérifier que tout fonctionne

- Le backend tourne sur `localhost:3001` ✅
- Le frontend tourne sur `localhost:3000` ✅
- La page de connexion s'affiche dans le navigateur ✅

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

1. Aller sur **http://localhost:3000**
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

1. Sur la page de connexion, entrer l'email et le mot de passe
2. Cliquer sur **CONNEXION**
3. Un overlay vert apparaît sur le fond (indicateur de session active)
4. Redirection automatique vers la page d'accueil

---

### Étape 3 — Construire son deck

> ⚠️ **Obligatoire avant de lancer une partie.** Le deck doit contenir exactement 20 cartes.

1. Depuis l'accueil, cliquer sur **📋 Modifier le deck** (ou onglet **DECKS** en mobile)
2. Dans la colonne **Ma Collection** (gauche), cliquer sur une carte pour l'ajouter au deck
3. Dans la colonne **Votre Deck** (centre), cliquer sur une carte pour la retirer
4. Répéter jusqu'à avoir **20/20 cartes**
5. Optionnel : sauvegarder le deck dans l'un des 3 emplacements (bouton 📥)
6. Retourner à l'accueil

**En mobile :** cliquer sur **📋 Modifier le deck** pour passer en vue édition, puis **📥 Sauvegarder** pour valider.

---

### Étape 4 — Lancer une partie (Matchmaking)

> Les deux joueurs doivent avoir leur deck de 20 cartes prêt avant cette étape.

**Joueur A :**
1. Depuis l'accueil, cliquer sur **▶ Lancer une partie**
2. Un spinner de chargement s'affiche — le joueur est inscrit dans la liste d'attente
3. Redirection automatique vers la page **Matchmaking**

**Joueur B :** faire la même chose sur un autre navigateur/compte.

**Dans le lobby Matchmaking :**
- La liste des joueurs en attente se rafraîchit toutes les 5 secondes
- **Joueur A** voit **Joueur B** dans la liste → cliquer sur **⚔️ Défier**
- **Joueur B** reçoit le défi dans la section **Défis reçus** → cliquer sur **✅ Accepter**
- Les deux joueurs sont redirigés automatiquement vers `/game`

---

### Étape 5 — Jouer la partie

#### Initialisation
- Au chargement de la page `/game`, le deck est automatiquement envoyé au serveur (`initDeck`)
- Quand les deux joueurs ont envoyé leur deck, la partie commence
- Chaque joueur démarre avec **4 cartes en main**

#### Déroulement d'un tour

Le plateau affiche :
- **En haut** : board adverse (cartes posées) + HP adversaire
- **Au centre** : indicateur de tour + bouton **⚡ Fin du tour** (visible si c'est votre tour)
- **En bas** : votre board + vos HP
- **Tout en bas** : votre main en éventail + carte PIOCHER à gauche + carte PASSER à droite

**Si c'est votre tour (`A ton tour`) :**

| Action | Comment faire |
|---|---|
| **Piocher une carte** | Cliquer sur la carte **🃏 PIOCHER** (gauche de la main). Disponible 1 fois par tour. |
| **Poser une carte** | Cliquer sur une carte dans votre main. Elle passe sur votre board. Max 5 cartes sur le board. |
| **Attaquer un champion adverse** | 1. Cliquer sur **votre carte** sur le board (elle se surligne en doré). 2. Cliquer sur la **carte adverse** à attaquer. |
| **Attaquer le joueur adverse** | Si le board adverse est vide : 1. Sélectionner votre carte (clic). 2. Cliquer sur **"Attaquer [nom]"** qui apparaît près du portrait adverse. |
| **Finir le tour** | Cliquer sur **⚡ Fin du tour** (centre du plateau) ou sur la carte **PASSER** (droite de la main). |

> ⚠️ **Restrictions importantes :**
> - Une carte posée ce tour **ne peut pas attaquer** avant le tour suivant
> - Une carte ne peut attaquer **qu'une fois par tour**
> - On ne peut piocher **qu'une fois par tour**
> - Le board est limité à **5 cartes** par joueur

**Si ce n'est pas votre tour (`Tour adverse`) :**
- Attendre. Le plateau se rafraîchit automatiquement toutes les 3 secondes.
- Dès que l'adversaire termine son tour, `A ton tour` s'affiche.

#### Résolution des attaques

| Situation | Résultat |
|---|---|
| ATK attaquant > DEF adverse | Carte adverse détruite. Différence (ATK - DEF) retirée aux HP adverses. |
| ATK = DEF | Les deux cartes sont détruites. HP inchangés. |
| ATK < DEF | Carte attaquante détruite. HP inchangés. |
| Board adverse vide | Attaque directe : toute l'ATK retirée aux HP adverses. |

---

### Étape 6 — Fin de partie

- Quand les HP d'un joueur tombent à **0 ou moins**, la partie se termine
- Un overlay apparaît automatiquement :
  - 🏆 **Victoire !** si l'adversaire est à 0 HP
  - 💀 **Défaite...** si vous êtes à 0 HP
- Cliquer sur **Retour à l'accueil** pour revenir au dashboard
- Les deux joueurs sont retirés du matchmaking et peuvent relancer une partie

---

### Étape 7 — Gérer son profil

Accessible via **Navbar → votre nom** (desktop) ou **onglet Profil** en haut à droite (mobile).

- **Déconnexion** : clique sur DÉCONNEXION → retour à la page de connexion, overlay vert retiré
- **Suppression de compte** : clique sur SUPPRIMER LE COMPTE → saisir le mot de passe pour confirmer → compte supprimé définitivement

---

## Architecture API

Toutes les requêtes après connexion incluent le token dans le header `WWW-Authenticate`.

```
GET /matchmaking/participate    → Rejoindre la liste d'attente
GET /matchmaking/getAll         → Lister les joueurs disponibles
GET /matchmaking/request        → Envoyer un défi (?matchmakingId=...)
GET /matchmaking/acceptRequest  → Accepter un défi (?matchmakingId=...)

GET /match/getMatch             → État complet du match (polling 3s)
GET /match/initDeck             → Envoyer son deck (?deck=[...] encodé)
GET /match/pickCard             → Piocher une carte
GET /match/playCard             → Poser une carte (?card=key)
GET /match/attack               → Attaquer un champion (?card=key&ennemyCard=key)
GET /match/attackPlayer         → Attaquer le joueur (?card=key)
GET /match/endTurn              → Finir le tour
GET /match/finishMatch          → Clôturer le match terminé
```

---

## Dépôts Git

| Dépôt | URL |
|---|---|
| **GitLab (principal)** | https://mi-git.univ-tlse2.fr/olti.mjeku/leagueofstones.git |
| **GitHub (miroir)** | https://github.com/Itloow/league-of-stones.git |

---

## Déploiement

L'application est déployée sur le serveur de la faculté à l'adresse suivante :

```
https://mi-phpmut.univ-tlse2.fr/~COMPTE_ENT/projet_web_L3/
```

---

*League of Stones — Groupe 6 — L3 MIASHS — Université Toulouse 2 Jean Jaurès — 2026*
