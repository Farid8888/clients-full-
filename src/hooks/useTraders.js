import { useContext } from "react";
import { TradersContext } from "contexts/TradersContext";

const useTraders = () => useContext(TradersContext);
export default useTraders;