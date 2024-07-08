import { useContext } from "react";
import { PaymentProviderContext } from "contexts/PaymentProviderContext";

const usePaymentProvider = () => useContext(PaymentProviderContext);
export default usePaymentProvider;