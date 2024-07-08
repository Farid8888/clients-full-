import { useContext } from "react";
import { ApiKeysContext } from "contexts/ApiKeysContext";

const useApiKeys = () => useContext(ApiKeysContext);
export default useApiKeys;