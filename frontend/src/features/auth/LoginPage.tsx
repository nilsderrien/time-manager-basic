import { useNavigate } from 'react-router-dom';
import { setSession } from './session';

export default function LoginPage() {
  const navigate = useNavigate();

  // TEMPORAIRE : simule une connexion tant que le backend n'est pas branché
  const fakeLogin = (role: 'employee' | 'manager') => {
    setSession('fake-token', role);
    navigate(role === 'manager' ? '/dashboard' : '/');
  };

  return (
    <main>
      <h1>Connexion</h1>
      <button type="button" onClick={() => fakeLogin('employee')}>
        Simuler un employé
      </button>
      <button type="button" onClick={() => fakeLogin('manager')}>
        Simuler un manager
      </button>
    </main>
  );
}
