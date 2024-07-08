import { Outlet } from "react-router-dom";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
// CUSTOM COMPONENTS
import ErrorView from "page-sections/permission/ErrorView";

// ==============================================================

// ==============================================================

const CustomRoleBasedGuard = ({
    children,
    roles
}) => {
    const {
        roleName
    } = useAuth();

    if (roleName && roles.includes(roleName)) return <>{children || <Outlet />}</>;
    return <ErrorView />;
};
export default CustomRoleBasedGuard;