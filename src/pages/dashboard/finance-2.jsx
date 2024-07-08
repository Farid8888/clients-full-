import { useEffect } from "react";
import { Finance2PageView } from "page-sections/dashboards/finances/page-view";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
import useNavigate from "hooks/useNavigate";

const Finance2Page = () => {
  const navigate = useNavigate();
  const { roleName } = useAuth();
  useEffect(() => { roleName === "Owner" && navigate("/dashboard/account"); });
  return <Finance2PageView />;
};
export default Finance2Page;