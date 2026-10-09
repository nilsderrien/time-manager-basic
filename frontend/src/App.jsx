import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('...');

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('indisponible'));
  }, []);

  return (
    <main>
      <h1>Time Manager</h1>
      <p>API : {status}</p>
    </main>
  );
}
