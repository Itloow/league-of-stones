# 📝 Compte-rendu : Tâche 13 - Flux d'Inscription et d'Accueil

Ce document détaille l'ensemble des fichiers créés et modifiés pour accomplir la **Tâche 13** (Création de compte), tout en intégrant les maquettes UI/UX et en assurant la compatibilité Mobile (Responsive Design de la Tâche 34).

## 🗂️ 1. Les Pages (Frontend React/Next.js)

### `src/pages/index.jsx` (Page d'Accueil / Connexion)
* **Action :** Modification complète.
* **Détails :** Transformation de la page par défaut en véritable point d'entrée du jeu. Mise en place du formulaire de connexion (visuel) et des boutons de redirection vers l'inscription et la page "À propos".

### `src/pages/register.jsx` (Page d'Inscription)
* **Action :** Création / Modification.
* **Détails :** Implémentation de la logique de création de compte. 
  * Ajout des contrôles de sécurité front-end : vérification du domaine de l'email (`@univ-tlse2.fr`), de la longueur du pseudo (3 à 28 caractères) et de la correspondance des mots de passe.
  * Branchement à l'API centralisée pour la requête serveur.
  * Redirection automatique vers la page de succès via `useRouter` une fois le compte enregistré en base de données.

### `src/pages/success.jsx` (Page de Confirmation)
* **Action :** Création.
* **Détails :** Nouvelle page ajoutée pour améliorer l'expérience utilisateur (remplacement des alertes natives basiques). Affiche un message de succès (avec gestion de l'espace insécable `&nbsp;` pour éviter les "veuves" typographiques) et un bouton de retour à l'accueil.

### `src/pages/about.jsx` (Page À propos)
* **Action :** Création.
* **Détails :** Intégration d'une page entière listant les membres de l'équipe et l'origine du projet, scrupuleusement fidèle à la maquette de présentation.

---

## 🎨 2. Les Styles (CSS Modules & Responsive)

### `src/styles/Home.module.css` & `src/styles/Register.module.css`
* **Action :** Refonte totale.
* **Détails :** * Application stricte de la charte graphique (fond blanc forcé pour contrer le dark-mode du navigateur, boutons en forme de pilules de couleur violette `#3b00b3`).
  * **Responsive Design fluide :** Abandon des Media Queries brutales à `100%` au profit d'une combinaison `width: 90%; max-width: 400px;`. Cela permet aux formulaires et boutons de s'étirer harmonieusement sur grand écran tout en rétrécissant de manière fluide sur smartphone, sans "saut" visuel inattendu.
  * Inversion de l'ordre des boutons sur mobile (`flex-direction: column-reverse`) pour une meilleure ergonomie (l'action principale passe au-dessus).

### `src/styles/Success.module.css` & `src/styles/About.module.css`
* **Action :** Création.
* **Détails :** Définition des styles spécifiques pour ces nouvelles pages, en garantissant la cohérence globale (couleurs, polices, alignements et comportement responsive fluide).

---

## ⚙️ 3. Les Services (Appels réseau)

### `src/services/api.js`
* **Action :** Intégration et utilisation.
* **Détails :** Centralisation de la route d'inscription. La fonction `inscription(email, name, password)` exécute un `fetch` avec la méthode `PUT` ciblant spécifiquement `http://localhost:3001` (le backend) afin de résoudre le conflit de port avec le serveur de développement Next.js (qui tourne sur le port `3000`).

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