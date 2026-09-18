# SkillSwap — Front-end

Front-end Vue 3 (Composition API, TypeScript) de SkillSwap, branché sur l'API
Laravel du dossier `skillswap-api`. Design mobile-first avec navigation
dédiée mobile (bottom tab bar) et desktop (barre horizontale), construit
avec Tailwind CSS v4 et des composants accessibles (Reka UI + shadcn-vue
style).

## Stack

- **Vue 3** + `<script setup>` + TypeScript
- **Vite** (build & dev server)
- **Vue Router 4** (navigation + gardes d'authentification/rôle)
- **Pinia** (état global : session, catégories, notifications)
- **Axios** (client HTTP, intercepteurs token + erreurs)
- **Tailwind CSS v4** + **Reka UI** (primitives accessibles headless) + **class-variance-authority**
- **vee-validate** + **zod** (validation de formulaires)

## Prérequis

- Node.js 20+
- L'API `skillswap-api` démarrée localement (voir son propre README), par
  défaut sur `http://localhost:8000`.

## Démarrage

```bash
npm install
cp .env.example .env   # ajuster VITE_API_URL si besoin
npm run dev
```

L'application est servie sur `http://localhost:5173`.

## Connexion à l'API

Le front consomme l'API REST de `skillswap-api` (Laravel + Sanctum, jetons
Bearer — pas de cookies de session). Un seul réglage est nécessaire :

- **`VITE_API_URL`** (dans `.env`) : URL de base de l'API, préfixe `/api`
  inclus (ex: `http://localhost:8000/api`).

Côté API, `CORS_ALLOWED_ORIGINS=*` (valeur par défaut de
`skillswap-api/.env.example`) suffit pour le développement local. Pour la
production, restreindre cette variable au domaine réel du front.

Le jeton d'authentification est stocké dans `localStorage` et envoyé sur
chaque requête via l'en-tête `Authorization: Bearer <token>`
(`src/lib/http.ts`). Un 401 renvoyé par l'API déclenche une déconnexion
locale automatique et une redirection vers `/connexion`.

## Structure du projet

```
src/
  components/
    ui/          Composants de base réutilisables (bouton, dialog, select...)
    layout/       Barres de navigation mobile/desktop, layout admin
    common/       Composants métier partagés (carte d'annonce, badges...)
    forms/        Aides de formulaire
    reservations/ Composants liés aux réservations
    admin/         Composants de l'espace d'administration
  lib/
    http.ts       Client Axios + gestion d'erreurs typée (ApiError)
    api/           Un module par ressource de l'API (auth, items, skills...)
  stores/          Stores Pinia (auth, catégories, notifications)
  router/          Routes, gardes de navigation, entrées de menu
  layouts/         Enveloppes de mise en page (app, admin, auth)
  pages/           Écrans, organisés par domaine
  types/           Types alignés sur les Resources/Enums de l'API Laravel
```

## Espaces de l'application

- **Public / membre** (`/`, `/objets/:id`, `/competences/:id`,
  `/connexion`, `/inscription`) : catalogue, détail, réservation.
- **Membre connecté** (`/mes-annonces`, `/reservations`, `/profil`) :
  gestion de ses propres annonces (objets et compétences) et de ses
  réservations envoyées/reçues.
- **Administration** (`/admin/*`) : tableau de bord, catégories,
  utilisateurs, modération des objets et compétences. Accès réservé aux
  comptes avec le rôle `admin` (garde de route `requiresAdmin`).

## Scripts

```bash
npm run dev       # serveur de développement
npm run build      # vérification des types (vue-tsc) + build de production
npm run preview    # sert le build de production localement
```
