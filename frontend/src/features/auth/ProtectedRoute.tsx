import { Navigate, Outlet } from "react-router-dom";
import { getRole, getToken, type Role } from "./session";

export default function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const role = getRole();
  if (!getToken()) return <Navigate to="/login" replace />;
  if (roles && (!role || !roles.includes(role))) return <Navigate to="/" replace />;
  return <Outlet />;
}
