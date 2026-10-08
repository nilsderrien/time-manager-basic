# Architecture du projet

Le projet est organisé en plusieurs parties afin de séparer le frontend, le backend, la base de données et la configuration technique.

```text
.
├── backend/
├── frontend/
├── documentation/
├── nginx/
└── docker-compose.yml
```

## Backend

Le dossier `backend/` contient l'API et la logique applicative.

* `src/commands/` : commandes qui représentent les actions pouvant modifier les données.
* `src/queries/` : requêtes utilisées pour récupérer les données.
* `src/controllers/` : gestion des requêtes HTTP et des réponses de l'API.
* `src/usecases/` : logique métier et orchestration des actions.
* `src/schemas/` : schémas Zod utilisés pour valider les données reçues ou manipulées par l'API.
* `database/` : configuration Sequelize, modèles de données et script de seed.
* `tests/` : tests du backend, organisés par fonctionnalité.
* `Dockerfile` : image Docker du backend.

Les schémas Zod utilisés comme contrats entre le frontend et le backend peuvent être placés dans un espace partagé du projet, par exemple `shared/` ou dans un package dédié si le projet évolue vers une organisation en monorepo.


## Frontend

Le dossier `frontend/` contient l'application React.

* `src/components/` : composants réutilisables.
* `src/pages/` : pages de l'application.
* `src/services/` : communication avec l'API et services frontend.
* `Dockerfile` : image Docker du frontend.

## Documentation

Le dossier `documentation/` contient la documentation technique du projet.

* `architecture.md` : organisation et architecture du projet.
* `schema.dbml` : définition du schéma de la base de données.

## Nginx

Le dossier `nginx/` contient la configuration du reverse proxy utilisé pour router les requêtes vers les différents services.

## Docker Compose

Le fichier `docker-compose.yml` orchestre les différents services du projet, notamment le frontend, le backend et PostgreSQL.
