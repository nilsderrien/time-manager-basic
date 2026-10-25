import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import KpiDashboardPage from '../features/kpi/KpiDashboardPage';
import TeamsPage from '../features/teams/TeamsPage';
import ClockPage from '../features/time/ClockPage';
import UsersPage from '../features/users/UsersPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />, // connecté, tous rôles
    children: [{ path: '/', element: <ClockPage /> }],
  },
  {
    element: <ProtectedRoute roles={['manager']} />, // managers uniquement
    children: [
      { path: '/dashboard', element: <KpiDashboardPage /> },
      { path: '/users', element: <UsersPage /> },
      { path: '/teams', element: <TeamsPage /> },
    ],
  },
]);
