import { useEffect, useState } from 'react';
import { UserListSchema, type UserSummary } from '@time-manager/contracts';
import { api } from '../../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api
      .get('/users')
      .then(({ data }) => {
        const parsedUsers = UserListSchema.parse(data);
        if (active) setUsers(parsedUsers);
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
