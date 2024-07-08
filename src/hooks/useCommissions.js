import { useContext } from "react";
import { CommissionsContext } from "contexts/CommissionsContext";

const useCommissions = () => useContext(CommissionsContext);
export default useCommissions;