# Loomi

## Installation
- cd server 
- pnpm install
- docker compose up -d
- npx prisma migrate dev
- pnpm run start:dev

- cd client
- pnpm install
- pnpm run dev
- ouvrir http://localhost:3001

(PS : On a essayé de faire un docker-compose pour tout lancer en même temps, mais on a pas réussi)

## Contributions de l'équipe :

### Alexandre :

- Mise en place client et server
- Communication socket io pour les questions une fois la partie lancer
- Synchronisation des états de jeu

### Armand :

- Gestion des scores
- Notifications en temps réel
- Mise en place du Lobby (server) avant la partie

### Noé :

- Gestion du timer pour les parties
- System de vote pour modifier le temps des questions suivante
- Mise en place du Lobby (server) avant la partie

### Théo :

- CRUD des questions / response
- Gestion du tchat en direct depuis le Lobby
- Setup BDD

## A savoir :

Certaines fonctionnalités comme le timer en front sont bugger a cause d'un clear timestamp problematique (le timer coter sevreur fonctionne bien)

## BONUS :

### Stockage de données persistant :

Mise en place de la sauvegarde des quiz et des questions, une interface swagger est aussi a disposition sur /api

### Tableau de classement en temps réel

Affichage du score des joueurs de la partie entrent les questions