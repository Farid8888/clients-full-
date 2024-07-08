import { AddNewUserPageView } from "page-sections/dashboards/admin/page-view";
import { ClientsProvider } from "contexts/ClientsContext";
import { TradersProvider } from "contexts/TradersContext";

const AddNewUserPage = () => {
  return <TradersProvider><ClientsProvider><AddNewUserPageView /></ClientsProvider></TradersProvider>;
};
export default AddNewUserPage;