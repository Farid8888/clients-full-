import { Outlet } from "react-router-dom";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
// CUSTOM COMPONENTS
import ErrorView from "page-sections/permission/ErrorView";

// ==============================================================

// ==============================================================

const RoleBasedGuard = ({
  children,
  roles
}) => {
  const {
    user
  } = useAuth();
  const loggedInUserRole = user?.role;
  if (loggedInUserRole && roles.includes(loggedInUserRole)) return <>{children || <Outlet />}</>;
  return <ErrorView />;
};
export default RoleBasedGuard;