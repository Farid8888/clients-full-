import { useContext } from "react";
import { TFAContext } from "contexts/TFAContext";

const useTFApp = () => useContext(TFAContext);
export default useTFApp;