import { AddCustomCommissionPageView } from "page-sections/dashboards/admin/commissions/page-view";
import { CommissionsProvider } from "contexts/CommissionsContext";

const AddPersonalCommissonPage = () => {
  return <CommissionsProvider><AddCustomCommissionPageView /></CommissionsProvider>;
};
export default AddPersonalCommissonPage;