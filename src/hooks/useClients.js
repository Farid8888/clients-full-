import { useContext } from "react";
import { ClientsContext } from "contexts/ClientsContext";

const useClients = () => useContext(ClientsContext);
export default useClients;