# Routes du projet Time Manager

Toutes les routes métier utilisent le préfixe **`/api`**.

Les routes ci-dessous constituent une proposition couvrant le périmètre fonctionnel décrit et le schéma de base de données fourni. Les fonctionnalités centrales du projet sont distinguées des routes complémentaires déduites des tables de congés, de plannings, de justifications de retard et d’audit.

## 1. Authentification et gestion des sessions

Ces routes permettent de se connecter, de renouveler une session, de gérer son mot de passe et de se connecter avec Microsoft OAuth 2.0.

| Méthode | Route | Fonction |
|---|---|---|
| `POST` | `/auth/login` | Se connecter avec email et mot de passe |
| `POST` | `/auth/refresh` | Renouveler la session avec un refresh token |
| `POST` | `/auth/logout` | Fermer la session courante et révoquer son token |
| `POST` | `/auth/logout-all` | Révoquer toutes les sessions de l’utilisateur |
| `GET` | `/auth/me` | Récupérer l’identité et le rôle associés à la session |
| `POST` | `/auth/password/forgot` | Demander une réinitialisation du mot de passe |
| `POST` | `/auth/password/reset` | Réinitialiser le mot de passe avec un jeton valide |
| `PATCH` | `/auth/password` | Modifier son mot de passe en étant connecté |
| `GET` | `/auth/microsoft` | Démarrer la connexion avec Microsoft |
| `GET` | `/auth/microsoft/callback` | Recevoir le retour du fournisseur Microsoft |
| `GET` | `/auth/microsoft/link` | Démarrer l’association d’un compte Microsoft au compte courant |
| `DELETE` | `/auth/microsoft/link` | Dissocier le compte Microsoft du compte courant |

**À noter :** la table `refresh_tokens` permet de gérer les sessions renouvelables. En revanche, la BDD ne contient pas de table dédiée aux jetons de réinitialisation du mot de passe. Il faudra prévoir un stockage sécurisé de ces jetons ou une solution équivalente.

## 2. Utilisateurs et comptes employés

Ces routes couvrent la consultation, la création, la modification et la suppression des utilisateurs.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/users` | Lister les utilisateurs |
| `POST` | `/users` | Créer un utilisateur, notamment par un manager |
| `GET` | `/users/me` | Récupérer son propre profil |
| `PATCH` | `/users/me` | Modifier son propre profil |
| `DELETE` | `/users/me` | Demander la suppression de son compte |
| `GET` | `/users/:userId` | Consulter un utilisateur précis |
| `PATCH` | `/users/:userId` | Modifier un utilisateur |
| `DELETE` | `/users/:userId` | Supprimer ou désactiver un utilisateur |
| `PATCH` | `/users/:userId/status` | Activer ou désactiver un compte |

**Paramètres utiles pour `GET /users` :** `search`, `role`, `teamId`, `departmentId`, `isActive`, `page` et `limit`.

**Règles d’accès à prévoir :** un employé ne doit accéder qu’à ses propres données, sauf autorisation particulière. Les managers doivent être limités aux équipes dont ils ont la responsabilité. Les administrateurs peuvent disposer d’un accès global.

Pour `DELETE`, une désactivation logique via `is_active` plutôt qu’une suppression physique immédiate peut préserver les historiques de pointage et faciliter l’application d’une politique de conservation des données.

## 3. Départements

La BDD contient une table `departments`. Ces routes permettent d’administrer la structure de l’entreprise.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/departments` | Lister les départements |
| `POST` | `/departments` | Créer un département |
| `GET` | `/departments/:departmentId` | Consulter un département |
| `PATCH` | `/departments/:departmentId` | Modifier un département |
| `DELETE` | `/departments/:departmentId` | Supprimer un département si les contraintes le permettent |
| `GET` | `/departments/:departmentId/teams` | Lister les équipes d’un département |

## 4. Équipes et membres

Le CRUD des équipes fait partie des fonctionnalités demandées.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/teams` | Lister les équipes accessibles |
| `POST` | `/teams` | Créer une équipe |
| `GET` | `/teams/:teamId` | Consulter une équipe |
| `PATCH` | `/teams/:teamId` | Modifier le nom, le département ou le manager |
| `DELETE` | `/teams/:teamId` | Supprimer une équipe si elle ne contient plus de dépendances |
| `GET` | `/teams/:teamId/members` | Lister les membres d’une équipe |
| `POST` | `/teams/:teamId/members` | Ajouter un employé à une équipe |
| `DELETE` | `/teams/:teamId/members/:userId` | Retirer un employé d’une équipe |
| `PATCH` | `/teams/:teamId/manager` | Affecter ou remplacer le manager d’une équipe |

Les opérations sur les membres correspondent au champ `users.team_id` de la BDD. Avec ce modèle, un utilisateur ne peut être affecté qu’à une seule équipe à la fois.

**Point de schéma :** les consignes décrivent une équipe avec un nom, une description, des membres et un manager, mais la table `teams` ne contient actuellement aucun champ `description`. Ajouter par exemple `description TEXT` si cette information doit être enregistrée.

## 5. Plannings et horaires habituels

Cette partie repose sur la table `employee_schedules`, qui enregistre les horaires prévus pour chaque jour de la semaine.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/users/:userId/schedules` | Consulter le planning d’un employé |
| `POST` | `/users/:userId/schedules` | Ajouter un horaire à son planning |
| `PUT` | `/users/:userId/schedules` | Remplacer l’ensemble du planning hebdomadaire |
| `GET` | `/schedules/:scheduleId` | Consulter un horaire précis |
| `PATCH` | `/schedules/:scheduleId` | Modifier un horaire |
| `DELETE` | `/schedules/:scheduleId` | Supprimer un horaire |

## 6. Pointages : arrivées, départs et historiques

Cette famille couvre l’enregistrement des arrivées et des départs ainsi que la consultation des pointages par l’utilisateur concerné ou par un manager autorisé.

| Méthode | Route | Fonction |
|---|---|---|
| `POST` | `/time-entries/clock-in` | Enregistrer l’arrivée de l’utilisateur connecté |
| `POST` | `/time-entries/clock-out` | Enregistrer son départ |
| `GET` | `/time-entries` | Lister les pointages selon les droits et les filtres |
| `GET` | `/time-entries/:timeEntryId` | Consulter un pointage précis |
| `PATCH` | `/time-entries/:timeEntryId` | Corriger un pointage avec les autorisations nécessaires |
| `GET` | `/users/:userId/time-entries` | Consulter l’historique d’un employé |

Filtres recommandés pour `GET /time-entries` : `userId`, `teamId`, `from`, `to` et `page`.

Au moment du pointage d’arrivée, le backend doit récupérer le planning applicable et enregistrer les valeurs `scheduled_start_at` et `scheduled_end_at` dans `time_entries`. Ces valeurs sont des copies des horaires prévus au moment du pointage : elles ne doivent pas être modifiées rétroactivement si le planning change.

Pour les corrections de pointage, il est recommandé de conserver une trace d’audit plutôt que d’effacer l’historique.

## 7. Justifications de retard

Cette fonctionnalité s’appuie sur `late_justifications`, avec les statuts `pending`, `approved` et `rejected`.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/late-justifications` | Lister les justifications accessibles |
| `POST` | `/late-justifications` | Soumettre une justification de retard |
| `GET` | `/late-justifications/:justificationId` | Consulter une justification |
| `PATCH` | `/late-justifications/:justificationId` | Modifier une justification encore modifiable |
| `POST` | `/late-justifications/:justificationId/approve` | Approuver une justification |
| `POST` | `/late-justifications/:justificationId/reject` | Refuser une justification |

La création doit identifier le pointage concerné et le propriétaire du compte à partir des informations authentifiées. Le manager chargé de l’examen ne doit pas être librement choisi par un employé dans le corps de la requête.

## 8. Demandes de congés

Le schéma BDD prévoit une table `leave_requests` pour gérer les demandes de congés. Ces routes permettent d’exploiter cette fonctionnalité.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/leave-requests` | Lister les demandes accessibles |
| `POST` | `/leave-requests` | Déposer une demande de congé |
| `GET` | `/leave-requests/:requestId` | Consulter une demande |
| `PATCH` | `/leave-requests/:requestId` | Modifier une demande encore en attente |
| `POST` | `/leave-requests/:requestId/cancel` | Annuler une demande selon les règles définies |
| `POST` | `/leave-requests/:requestId/approve` | Approuver une demande |
| `POST` | `/leave-requests/:requestId/reject` | Refuser une demande |

Filtres recommandés pour la liste : `userId`, `reviewerId`, `status`, `leaveType`, `from` et `to`.

Il faut contrôler les dates, le chevauchement des demandes et les permissions du responsable. Une annulation doit modifier le statut en `cancelled` plutôt que supprimer l’historique de la demande.

## 9. Soldes et droits à congés

Cette famille de routes s’appuie sur `leave_balances`, qui stocke les jours acquis et utilisés par personne, type de congé et année.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/leaves` | Lister les congés |
| `GET` | `/leave/me` | Consulter ses propres congés |
| `GET` | `/users/:userId/leave` | Consulter les congés d’un employé |
| `DELETE` | `/users/:userId/leave/:leave-id` | Supprimer un  congé |

La valeur du solde disponible peut être calculée à partir de `entitled_days` et `used_days`. Il faudra définir à quel moment les jours sont considérés comme utilisés : à l’approbation, au début du congé ou après celui-ci.

## 10. Rapports horaires et statistiques

Cette partie couvre les heures quotidiennes et hebdomadaires des employés, les moyennes des équipes ainsi que les rapports globaux de KPI.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/reports/time-summary` | Obtenir une synthèse horaire filtrée |
| `GET` | `/reports/users/:userId/hours` | Consulter les heures quotidiennes ou hebdomadaires d’un employé |
| `GET` | `/reports/teams/:teamId/average-hours` | Calculer les moyennes quotidiennes et hebdomadaires d’une équipe |
| `GET` | `/reports/kpis` | Obtenir le rapport global de KPI |
| `GET` | `/users/:userId/stats` | Récupérer les statistiques enregistrées pour un employé |
| `GET` | `/stats` | Lister les statistiques selon les droits et les filtres |
| `GET` | `/dashboards/me` | Récupérer les indicateurs du tableau de bord personnel |
| `GET` | `/dashboards/users/:userId` | Récupérer le tableau de bord d’un employé autorisé |
| `GET` | `/dashboards/teams/:teamId` | Récupérer le tableau de bord d’une équipe autorisée |

Pour les rapports horaires, prévoir des filtres cohérents comme `from`, `to`, `groupBy=day|week`, `teamId` et `departmentId`.

### KPI a definir


## 11. Journal d’audit et traçabilité

Cette famille de routes exploite `audit_logs`. Elle est utile pour tracer les actions sensibles : corrections de pointages, validation de congés, changements de rôle et désactivation de comptes.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/audit-logs` | Renvoie les logs du dernier mois |
| `POST` | `/audit-logs/` | Consulter des événements Filtrés (date, type)  |

Filtres recommandés : `userId`, `gravity`, `from` et `to`.

## 12. Santé du backend

Ces routes complémentaires facilitent la supervision du service et les contrôles de déploiement.

| Méthode | Route | Fonction |
|---|---|---|
| `GET` | `/health` | Vérifier que le backend répond |

La route de disponibilité peut notamment vérifier que les dépendances indispensables, comme PostgreSQL, sont accessibles.