import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    clientsList: [],
    clientEditData: null,
    clientAddData: null,
    clientInfo: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    clientsList: [],
                    clientEditData: null,
                    clientAddData: null,
                    clientInfo: null
                };
            }
        case "UPDATECLIENTSLIST":
            {
                return {
                    ...state,
                    isInitialized: true,
                    clientsList: action.payload.clientsList,
                };
            }
        case "EDITCLIENT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    clientEditData: action.payload.clientEditData,
                };
            }
        case "ADDCLIENT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    clientAddData: action.payload.clientAddData,
                };
            }
        case "GETCLIENTINFO":
            {
                return {
                    ...state,
                    isInitialized: true,
                    clientInfo: action.payload.clientInfo,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const ClientsContext = createContext();

export const ClientsProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // ADD CLIENT HANDLER
    const addClient = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/client/AddClient`, {
                clients: [{
                    userName: param.userName,
                    email: param.email,
                    phone: param.phone,
                    password: param.password,
                    isBanned: param.isBanned,
                    balance: param.balance.toString(),
                    permissions: param.permissions
                }]
            });

            dispatch({
                type: "ADDCLIENT",
                payload: {
                    clientAddData: data
                }
            });
        }
    }, []);

    // EDIT CLIENT HANDLER
    const editClient = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/client/EditClient`, {
                clients: [param]
            });

            dispatch({
                type: "EDITCLIENT",
                payload: {
                    clientEditData: data
                }
            });
        }
    }, []);

    // GET CLIENT INFO HANDLER
    const getClientInfo = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.get(`${API_URL}/client/GetClientInfo?userId=${param.userId}`);

            dispatch({
                type: "GETCLIENTINFO",
                payload: {
                    clientInfo: data
                }
            });
        }
    }, []);
    
    // UPDATE CLIENTS LIST HANDLER
    const updateClientsList = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/client/GetClientsList`);

                dispatch({
                    type: "UPDATECLIENTSLIST",
                    payload: {
                        clientsList: data.clients,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATECLIENTSLIST",
                    payload: {
                        clientsList: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATECLIENTSLIST",
                payload: {
                    clientsList: []
                }
            });
        }
    }, []);

    // EFFECT INIT
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: {
                    clientsList: [],
                    clientEditData: null,
                    clientAddData: null
                }
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <ClientsContext.Provider value={{
        ...state,
        updateClientsList,
        addClient,
        editClient,
        getClientInfo
    }}>
        {children}
    </ClientsContext.Provider>;
};