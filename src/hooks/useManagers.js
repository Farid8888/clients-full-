import { useContext } from "react";
import { ManagersContext } from "contexts/ManagersContext";

const useManagers = () => useContext(ManagersContext);
export default useManagers;