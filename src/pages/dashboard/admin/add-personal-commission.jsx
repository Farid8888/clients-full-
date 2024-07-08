import { AddPersonalCommissionPageView } from "page-sections/dashboards/admin/commissions/page-view";
import { CommissionsProvider } from "contexts/CommissionsContext";
import { ClientsProvider } from "contexts/ClientsContext";
import { TradersProvider } from "contexts/TradersContext";

const AddPersonalCommissonPage = () => {
  return <TradersProvider><ClientsProvider><CommissionsProvider><AddPersonalCommissionPageView /></CommissionsProvider></ClientsProvider></TradersProvider>;
};
export default AddPersonalCommissonPage;