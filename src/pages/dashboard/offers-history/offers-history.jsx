import { useEffect } from "react";
import { OffersHistoryPageView } from "page-sections/dashboards/finances/offers-history";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
import useNavigate from "hooks/useNavigate";

const OffersHistoryPage = () => {
    const navigate = useNavigate();
    const { roleName } = useAuth();
    useEffect(() => { roleName === "Owner" && navigate("/dashboard/account"); });
    return <OffersHistoryPageView />;
};
export default OffersHistoryPage;