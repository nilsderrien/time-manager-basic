import type { UserSummary } from '@time-manager/contracts/users';
import { useEffect, useState } from 'react';
import { listUsers } from './users.api';

export default function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listUsers()
      .then((loadedUsers) => {
        if (active) setUsers(loadedUsers);
      })
      .catch(() => {
        if (active) setError('Impossible de charger les utilisateurs.');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      <h1>Utilisateurs</h1>
      {error ? <p role="alert">{error}</p> : null}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name} ({user.role})
          </li>
        ))}
      </ul>
    </main>
  );
}
