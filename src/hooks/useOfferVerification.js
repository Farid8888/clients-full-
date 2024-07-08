import { useContext } from "react";
import { OfferVerificationContext } from "contexts/OfferVerificationContext";

const useOfferVerfication = () => useContext(OfferVerificationContext);
export default useOfferVerfication;