import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('...');

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('indisponible'));
  }, []);

  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setError(null);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error(response.status);
      setUsers(await response.json());
    } catch {
      setUsers(null);
      setError('Impossible de charger les utilisateurs');
    }
  };

  return (
    <main>
      <h1>Time Manager</h1>
      <p>API : {status}</p>
      <button type="button" onClick={loadUsers}>
        Charger les utilisateurs
      </button>
      {error && <p>{error}</p>}
      {users && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} ({user.role})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
