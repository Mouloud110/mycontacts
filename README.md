# MyContacts - Gestionnaire de Contacts Personnel

Application web fullstack permettant de gérer son carnet de contacts avec authentification sécurisée.

## Fonctionnalités

- Authentification JWT (inscription/connexion)
- CRUD complet sur les contacts (Créer, Lire, Modifier, Supprimer)
- Isolation des données (chaque utilisateur ne voit que ses propres contacts)
- Mots de passe sécurisés avec bcrypt
- Documentation API Swagger
- Interface React responsive

## Stack Technique

### Frontend
- React 18
- Vite
- React Router DOM

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT pour l'authentification
- bcrypt pour le hachage des mots de passe
- Swagger pour la documentation API

## Installation

### Prérequis
- Node.js version 18 ou supérieure
- npm
- Compte MongoDB Atlas gratuit

### Cloner le repository
git clone https://github.com/Mouloud110/mycontacts.git
cd mycontacts

### Installation Backend
cd server
npm install

Créer un fichier .env dans le dossier server avec :
PORT=4000
MONGODB_URI=votre_connection_string_mongodb_atlas
JWT_SECRET=votre_cle_secrete_aleatoire
JWT_EXPIRES_IN=7d

### Installation Frontend
cd client
npm install

## Lancement en local

### Démarrer le backend
cd server
npm start
Backend accessible sur http://localhost:4000

### Démarrer le frontend
cd client
npm run dev
Frontend accessible sur http://localhost:5173

## Documentation API

Documentation Swagger accessible sur http://localhost:4000/docs

### Endpoints

#### Authentication
- POST /auth/register - Créer un compte
- POST /auth/login - Se connecter et obtenir un JWT
- GET /auth/me - Récupérer ses informations utilisateur (protégé)

#### Contacts (protégés par JWT)
- GET /contacts - Liste de tous mes contacts
- POST /contacts - Créer un nouveau contact
- PATCH /contacts/:id - Modifier un contact existant
- DELETE /contacts/:id - Supprimer un contact

## Sécurité

- Mots de passe hashés avec bcrypt (10 salt rounds)
- Authentification stateless avec JWT
- Expiration des tokens après 7 jours
- Isolation des données par ownership (champ owner dans chaque contact)
- CORS configuré pour autoriser le frontend

## Compte de test

Email : test@example.com
Password : test123456

Ou créer un nouveau compte via la page d'inscription.

## Déploiement

Backend déployé sur Render
Frontend déployé sur Render

URLs à venir après déploiement.

## Auteur

Mouloud
GitHub : https://github.com/Mouloud110

## Licence

Projet réalisé dans le cadre d'un module de formation fullstack 