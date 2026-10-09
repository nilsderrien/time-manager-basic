## 13. Routes du frontend React

Ce fichier propose les différentes pages du site et leur url

| Type | Route frontend | Page |
|---|---|---|
| Authentification | `/login` | Connexion |
| Authentification | `/forgot-password` | Demande de réinitialisation du mot de passe |
| Authentification | `/reset-password` | Réinitialisation du mot de passe |
| Authentification | `/auth/microsoft/callback` | Retour de connexion Microsoft |
| Commun | `/dashboard` | Tableau de bord selon le rôle |
| Commun | `/profile` | Profil et informations personnelles |
| Employé | `/my-time` | Historique et synthèse des heures |
| Employé | `/time-clock` | Enregistrer une arrivée ou un départ |
| Employé | `/my-schedule` | Consulter son planning |
| Employé | `/my-leaves` | Consulter ses demandes de congés |
| Employé | `/my-leaves/new` | Créer une demande de congé |
| Employé | `/my-late-justifications` | Consulter et déposer ses justifications |
| Manager | `/manager/team` | Vue de son équipe |
| Manager | `/manager/employees` | Liste de ses employés |
| Manager | `/manager/employees/:userId` | Détail et statistiques d’un employé |
| Manager | `/manager/schedules` | Gestion des plannings |
| Manager | `/manager/leave-requests` | Traitement des demandes de congés |
| Manager | `/manager/late-justifications` | Traitement des justifications de retard |
| Manager | `/manager/reports` | Rapports et KPI |
| Administrateur | `/admin/users` | Administration des comptes |
| Administrateur | `/admin/departments` | Gestion des départements |
| Administrateur | `/admin/teams` | Gestion globale des équipes |
| Administrateur | `/admin/audit-logs` | Consultation des journaux d’audit |