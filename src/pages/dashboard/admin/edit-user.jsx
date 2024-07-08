import { EditUserPageView } from "page-sections/dashboards/admin/page-view";
import { ClientsProvider } from "contexts/ClientsContext";
import { TradersProvider } from "contexts/TradersContext";

const EditUserPage = () => {
  return <TradersProvider><ClientsProvider><EditUserPageView /></ClientsProvider></TradersProvider>;
};
export default EditUserPage;