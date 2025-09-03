# Products Management App

## Description

Cette application permet de gérer une liste de produits avec les fonctionnalités suivantes :

- Affichage d’une liste de produits avec **pagination**.
- Ajout de nouveaux produits directement depuis le tableau.
- Édition des produits existants (nom, référence, prix et rating).
- Validation :
  - Chaque produit doit avoir une **référence unique**.
  - Le **prix doit être supérieur ou égal à 0 €**.
- Visualisation du **rating** sous forme d’étoiles avec édition via un composant interactif.
- Persistance des produits côté back-end (Node/Express).
- **Toasters** (Snackbar) pour notifier l’utilisateur des actions : chargement, succès ou erreur.

---

## Technologies utilisées

- **Front-end** : React, TypeScript, Material-UI (DataGrid, Rating, Snackbar)
- **Back-end** : Node.js, Express, TypeScript
- **Docker** : pour lancer front-end et back-end dans des conteneurs isolés
- **API REST** pour gérer les produits (GET, POST, PUT)

---

## Structure du projet
```
my-app/
├─ backend/ # Back-end Node/Express
│ ├─ index.ts # Serveur principal
│ ├─ products.ts # Routes produits
│ └─ package.json
├─ frontend/ # Front-end React
│ ├─ src/
│ │ ├─ ProductGrid.tsx
│ │ ├─ ProductService.ts
│ │ ├─ RatingEditInputCell.tsx
│ │ └─ ...
│ └─ package.json
├─ docker-compose.yml
└─ README.md
```

---

## Installation et lancement avec Docker

1. Construire et lancer les conteneurs Docker : :

```bash
cd my-app
docker-compose up --build
```

2. Accéder à l’application :

Front-end : http://localhost:5173
Back-end API : http://localhost:5000/api/products


Commandes utiles

Stop des conteneurs :
```bash
docker-compose down

```

Voir les logs front-end :
```bash
docker logs -f frontend

```

Voir les logs back-end :
```bash
docker logs -f backend

```

### Notes

- Les IDs des nouveaux produits temporaires sont générés négatifs côté front pour différencier les nouveaux produits avant qu’ils soient créés côté back.

c'est une implementation uniquement pour un projet en dev , étant donné qu'il n'y a pas de BDD . 

C’est une solution de contournement rapide adaptée à un projet en développement ou prototype où la persistance se fait en mémoire ou via un back simple.

## Dans un vrai projet :

Base de données et modèles

Les produits auraient un modèle dans la base de données (Product), et l’ID serait généré automatiquement par la DB (auto-increment, UUID, etc.).

Cela évite les IDs temporaires et les collisions.

Gestion des créations côté front

Le front envoie directement le nouveau produit au serveur via POST.

Le serveur renvoie le produit créé avec son ID réel.

Le front met à jour sa liste avec ce produit « officiel ».

Toutes les validations (référence unique, prix ≥ 0, etc.) doivent également être faites côté serveur pour éviter les incohérences si plusieurs clients modifient les données simultanément.