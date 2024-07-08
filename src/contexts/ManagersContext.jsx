import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    managersList: [],
    manager: null,
    managerEditData: null,
    managerAddData: null,
    managerRemoveData: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    managersList: [],
                    manager: null,
                    managerEditData: null,
                    managerAddData: null
                };
            }
        case "UPDATEMANAGERSLIST":
            {
                return {
                    ...state,
                    isInitialized: true,
                    managersList: action.payload.managersList,
                };
            }
        case "EDITMANAGER":
            {
                return {
                    ...state,
                    isInitialized: true,
                    managerEditData: action.payload.managerEditData,
                };
            }
        case "REMOVEMANAGER":
            {
                return {
                    ...state,
                    isInitialized: true,
                    managersList: action.payload.managersList,
                    managerRemoveData: action.payload.managerRemoveData,
                };
            }
        case "ADDMANAGER":
            {
                return {
                    ...state,
                    isInitialized: true,
                    managerAddData: action.payload.managerAddData,
                };
            }
        case "SETMANAGER":
            {
                return {
                    ...state,
                    isInitialized: true,
                    manager: action.payload.manager,
                };
            }
        case "RESETMANAGERDATAS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    managerAddData: action.payload.managerAddData,
                    managerEditData: action.payload.managerEditData,
                    managerRemoveData: action.payload.managerRemoveData,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const ManagersContext = createContext();

export const ManagersProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // ADD MANAGER HANDLER
    const addManager = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/client/AddManager`, {
                managers: [{
                    userName: param.userName,
                    email: param.email,
                    phone: param.phone,
                    password: param.password,
                }]
            });

            dispatch({
                type: "ADDMANAGER",
                payload: {
                    managerAddData: data
                }
            });
        }
    }, []);

    // EDIT MANAGER HANDLER
    const editManager = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/client/EditManager`, {
                managers: [{
                    id: param.id,
                    userName: param.userName,
                    email: param.email,
                    phone: param.phone,
                    password: param.password,
                    isBanned: param.isBanned
                }]
            });

            dispatch({
                type: "EDITMANAGER",
                payload: {
                    managerEditData: data
                }
            });
        }
    }, []);

    // REMVOE MANAGER HANDLER
    const removeManager = useCallback(async (ids, oldManagersList) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/client/RemoveManager`, {
                ids: ids
            });

            let newManagersList = oldManagersList;

            if (data.success) {
                newManagersList = newManagersList.filter(item => !ids.includes(item.id));
            }

            dispatch({
                type: "REMOVEMANAGER",
                payload: {
                    managersList: newManagersList,
                    managerRemoveData: data
                }
            });
        }
    }, []);

    // UPDATE MANAGERS LIST HANDLER
    const updateManagersList = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/client/GetMyManagers`);

                dispatch({
                    type: "UPDATEMANAGERSLIST",
                    payload: {
                        managersList: data.managers,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATEMANAGERSLIST",
                    payload: {
                        managersList: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATEMANAGERSLIST",
                payload: {
                    managersList: []
                }
            });
        }
    }, []);

    // SET MANAGER HANDLER
    const setManager = useCallback(async (param) => {
        dispatch({
            type: "SETMANAGER",
            payload: {
                manager: param
            }
        });
    }, []);

    // RESET MANAGER DATA`S HANDLER
    const resetManagerDatas = useCallback(async () => {
        dispatch({
            type: "RESETMANAGERDATAS",
            payload: {
                managerRemoveData: null,
                managerEditData: null,
                managerAddData: null
            }
        });
    }, []);

    // EFFECT INIT
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: { }
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <ManagersContext.Provider value={{
        ...state,
        updateManagersList,
        addManager,
        editManager,
        removeManager,
        setManager,
        resetManagerDatas
    }}>
        {children}
    </ManagersContext.Provider>;
};