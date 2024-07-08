import { Navigate } from "react-router-dom";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
import useLocation from "hooks/useLocation";

const AuthGuard = ({
  children
}) => {
  const {
    pathname
  } = useLocation();
  const {
    isAuthenticated
  } = useAuth();

  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/login" state={{
    from: pathname
  }} />;
};

export default AuthGuard;