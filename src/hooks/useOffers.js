import { useContext } from "react";
import { OffersContext } from "contexts/OffersContext";

const useOffers = () => useContext(OffersContext);
export default useOffers;