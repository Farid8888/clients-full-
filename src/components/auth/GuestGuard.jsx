import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
import useLocation from "hooks/useLocation";

const GuestGuard = ({
  children
}) => {
  const {
    pathname
  } = useLocation();
  const {
    isAuthenticated,
    isTfaEnabled
  } = useAuth();

  if (isTfaEnabled && !isAuthenticated && pathname !== "/verify-code") return <Navigate to="/verify-code" />;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return <Fragment>{children || <Outlet />}</Fragment>;
};

export default GuestGuard;