import { OffersProvider } from "contexts/OffersContext";
import { AddNewOfferPageView } from "page-sections/dashboards/finances/offers";
const AddNewOfferPage = () => {
    return <OffersProvider><AddNewOfferPageView /></OffersProvider>;
};
export default AddNewOfferPage;