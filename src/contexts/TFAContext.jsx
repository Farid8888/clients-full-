import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";
import { ReLogin, SomethingWrong } from "./common/customMessages";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    switchData: null,
    verifyAppData: null,
    tfAppData: null,
    removeTFAppData: null,
    status: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    switchData: null,
                    verifyAppData: null,
                    tfAppData: null,
                    removeTFAppData: null,
                    status: null
                };
            }
        case "GETSTATUS":
            {
                return {
                    ...state,
                    status: action.payload.status,
                };
            }
        case "SWITCHTFA":
            {
                return {
                    ...state,
                    switchData: action.payload.switchData,
                };
            }
        case "VERIFYAPP":
            {
                return {
                    ...state,
                    verifyAppData: action.payload.verifyAppData,
                };
            }
        case "GETTFADATA":
            {
                return {
                    ...state,
                    tfAppData: action.payload.tfAppData,
                };
            }
        case "REMOVETFAPP":
            {
                return {
                    ...state,
                    removeTFAppData: action.payload.removeTFAppData,
                    status: action.payload.status,
                };
            }
        default:
            {
                return state;
            }
    }
}

export const TFAContext = createContext();

export const TFAProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // GET STATUS HANDLER
    const getStatus = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/auth/TwoFactor/GetStatusTFA`);

                dispatch({
                    type: "GETSTATUS",
                    payload: {
                        status: data,
                    }
                });
            } else {
                dispatch({
                    type: "GETSTATUS",
                    payload: {
                        status: ReLogin
                    }
                });
            }
        } catch {
            dispatch({
                type: "GETSTATUS",
                payload: {
                    status: SomethingWrong
                }
            });
        }
    }, []);

    // SWITCH TFA HANDLER
    const switchTFA = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/auth/TwoFactor/SwitchTFA`);

                dispatch({
                    type: "SWITCHTFA",
                    payload: {
                        switchData: data,
                    }
                });
            } else {
                dispatch({
                    type: "SWITCHTFA",
                    payload: {
                        switchData: ReLogin
                    }
                });
            }
        } catch {
            dispatch({
                type: "SWITCHTFA",
                payload: {
                    switchData: SomethingWrong
                }
            });
        }
    }, []);

    // VERIFY APP HANDLER
    const verifyApp = useCallback(async (code) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/auth/TwoFactor/VerifyApp`, {
                    code: code
                });

                dispatch({
                    type: "VERIFYAPP",
                    payload: {
                        verifyAppData: data,
                    }
                });
            } else {
                dispatch({
                    type: "VERIFYAPP",
                    payload: {
                        verifyAppData: ReLogin
                    }
                });
            }
        } catch {
            dispatch({
                type: "VERIFYAPP",
                payload: {
                    verifyAppData: SomethingWrong
                }
            });
        }
    }, []);

    const resetVerifyAppData = () => {
        dispatch({
            type: "VERIFYAPP",
            payload: {
                verifyAppData: null,
            }
        });
    };

    // GET TFA DATA HANDLER
    const getTFAData = useCallback(async (code) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/auth/TwoFactor/GetTFAData`);

                dispatch({
                    type: "GETTFADATA",
                    payload: {
                        tfAppData: data,
                    }
                });
            } else {
                dispatch({
                    type: "GETTFADATA",
                    payload: {
                        tfAppData: ReLogin
                    }
                });
            }
        } catch {
            dispatch({
                type: "GETTFADATA",
                payload: {
                    tfAppData: SomethingWrong
                }
            });
        }
    }, []);

    // REMOVE TF APP HANDLER
    const removeTFApp = useCallback(async (code) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/auth/TwoFactor/RemoveTFAApp`);

                dispatch({
                    type: "REMOVETFAPP",
                    payload: {
                        removeTFAppData: data,
                        status: {
                            success: true,
                            message: {
                                enableTFA: false,
                                tfAppEnabled: false
                            }
                        }
                    }
                });
            } else {
                dispatch({
                    type: "REMOVETFAPP",
                    payload: {
                        removeTFAppData: ReLogin,
                        status: state.status
                    }
                });
            }
        } catch {
            dispatch({
                type: "REMOVETFAPP",
                payload: {
                    removeTFAppData: SomethingWrong,
                    status: state.status
                }
            });
        }
    }, [state.status]);

    const resetRemoveTFAppData = () => {
        dispatch({
            type: "REMOVETFAPP",
            payload: {
                removeTFAppData: null,
                status: state.status
            }
        });
    };

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

    return <TFAContext.Provider value={{
        ...state,
        getStatus,
        getTFAData,
        switchTFA,
        verifyApp,
        removeTFApp,
        resetVerifyAppData,
        resetRemoveTFAppData
    }}>
        {children}
    </TFAContext.Provider>;
};