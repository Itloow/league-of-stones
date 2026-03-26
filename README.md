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