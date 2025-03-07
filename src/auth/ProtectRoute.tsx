import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
