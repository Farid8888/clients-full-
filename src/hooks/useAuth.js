import { useContext } from "react";
import { AuthContext } from "contexts/jwtContext";
// import {AuthContext} from "contexts/auth0Context";
// import { AuthContext } from "contexts/firebaseContext";

const useAuth = () => useContext(AuthContext);
export default useAuth;