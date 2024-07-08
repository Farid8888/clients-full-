import { useContext } from "react";
import { CurrenciesContext } from "contexts/CurrenciesContext";

const useCurrencies = () => useContext(CurrenciesContext);
export default useCurrencies;