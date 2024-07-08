import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    tradersList: [],
    traderEditData: null,
    traderAddData: null,
    traderInfo: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    tradersList: [],
                    traderEditData: null,
                    traderAddData: null,
                    traderInfo: null
                };
            }
        case "UPDATETRADERSLIST":
            {
                return {
                    ...state,
                    isInitialized: true,
                    tradersList: action.payload.tradersList,
                };
            }
        case "EDITTRADER":
            {
                return {
                    ...state,
                    isInitialized: true,
                    traderEditData: action.payload.traderEditData,
                };
            }
        case "ADDTRADER":
            {
                return {
                    ...state,
                    isInitialized: true,
                    traderAddData: action.payload.traderAddData,
                };
            }
        case "GETTRADERINFO":
            {
                return {
                    ...state,
                    isInitialized: true,
                    traderInfo: action.payload.traderInfo,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const TradersContext = createContext();

export const TradersProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // ADD TRADER HANDLER
    const addTrader = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/admin/AddTrader`, {
                traders: [{
                    userName: param.userName,
                    email: param.email,
                    phone: param.phone,
                    password: param.password,
                    isBanned: param.isBanned,
                    balance: param.balance.toString(),
                    balanceLimit: param.balanceLimit.toString(),
                    permissions: param.permissions
                }]
            });

            dispatch({
                type: "ADDTRADER",
                payload: {
                    traderAddData: data
                }
            });
        }
    }, []);

    // EDIT TRADER HANDLER
    const editTrader = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/admin/EditTrader`, {
                traders: [param]
            });

            dispatch({
                type: "EDITTRADER",
                payload: {
                    traderEditData: data
                }
            });
        }
    }, []);
    
    // GET TRADER INFO HANDLER
    const getTraderInfo = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.get(`${API_URL}/trader/GetTraderInfo?userId=${param.userId}`);

            dispatch({
                type: "GETTRADERINFO",
                payload: {
                    traderInfo: data
                }
            });
        }
    }, []);
    
    // UPDATE TRADERS LIST HANDLER
    const updateTradersList = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/trader/GetTradersList`);

                dispatch({
                    type: "UPDATETRADERSLIST",
                    payload: {
                        tradersList: data.traders,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATETRADERSLIST",
                    payload: {
                        tradersList: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATETRADERSLIST",
                payload: {
                    tradersList: []
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
                    tradersList: [],
                    traderEditData: null,
                    traderAddData: null
                }
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <TradersContext.Provider value={{
        ...state,
        updateTradersList,
        addTrader,
        editTrader,
        getTraderInfo
    }}>
        {children}
    </TradersContext.Provider>;
};