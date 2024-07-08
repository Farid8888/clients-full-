import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    apiKeyData: null,
    apiKeyWhitelistData: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    apiKeyData: null,
                    apiKeyWhitelistData: null
                };
            }
        case "GETAPIKEY":
        case "REMOVEAPIKEY":
        case "SWITCHSTATUSAPIKEY":
        case "GENERATEAPIKEY":
            {
                return {
                    ...state,
                    isInitialized: true,
                    apiKeyData: action.payload.apiKeyData,
                };
            }
        case "CREATEAPIKEYWHITELIST":
        case "SWITCHSTATUSAPIKEYWHITELIST":
            {
                return {
                    ...state,
                    isInitialized: true,
                    apiKeyWhitelistData: action.payload.apiKeyWhitelistData,
                };
            }
        case "REMOVEAPIKEYWHITELIST":
            {
                return {
                    ...state,
                    isInitialized: true,
                    apiKeyData: action.payload.apiKeyData,
                    apiKeyWhitelistData: action.payload.apiKeyWhitelistData,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const ApiKeysContext = createContext();

export const ApiKeysProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // GENERATE API KEY HANDLER
    const generateApiKey = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/auth/User/GenerateApiKey`);

            state.apiKeyData.apiKey = data.apiKey;
            dispatch({
                type: "GENERATEAPIKEY",
                payload: {
                    apiKeyData: state.apiKeyData
                }
            });
        }
    }, [state.apiKeyData]);

    // SWITCH STATUS API KEY HANDLER
    const switchStatusApiKey = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/auth/User/SwitchApiKey`, { });

            state.apiKeyData.enabled = data.enabled;
            dispatch({
                type: "SWITCHSTATUSAPIKEY",
                payload: {
                    apiKeyData: state.apiKeyData
                }
            });
        }
    }, [state.apiKeyData]);

    // REMOVE API KEY HANDLER
    const removeApiKey = useCallback(async (values, traderId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/auth/User/RemoveApiKey`, {
                "traderId": traderId,
                "fiatsIds": values
            });
            state.apiKeyData.apiKey = null;
            state.apiKeyData.enabled = data.enabled;
            dispatch({
                type: "REMOVEAPIKEY",
                payload: {
                    apiKeyData: state.apiKeyData}
            });
        }
    }, [state.apiKeyData]);

    // GET API KEY HANDLER
    const getApiKey = useCallback(async (param) => {
        try {
            if (param === null) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/auth/User/GetApiKey`);

                dispatch({
                    type: "GETAPIKEY",
                    payload: {
                        apiKeyData: data,
                    }
                });
            } else {
                dispatch({
                    type: "GETAPIKEY",
                    payload: {
                        apiKeyData: null,
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "GETAPIKEY",
                payload: {
                    apiKeyData: null,
                }
            });
        }
    }, []);

    // SWITCH STATUS API KEY WHITELIST HANDLER
    const switchStatusApiKeyWhitelist = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/auth/User/SwitchApiKeyWhiteList`, {});

            state.apiKeyWhitelistData.enabled = data.enabled;

            dispatch({
                type: "SWITCHSTATUSAPIKEYWHITELIST",
                payload: {
                    apiKeyWhitelistData: state.apiKeyWhitelistData
                }
            });
        }
    }, [state.apiKeyWhitelistData]);

    // CREATE API KEY HANDLER
    const createApiKeyWhitelist = useCallback(async (ipAddress) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/auth/User/AddWhitelist`, {
                ipAddress
            });

            dispatch({
                type: "CREATEAPIKEYWHITELIST",
                payload: {
                    apiKeyWhitelistData: data
                }
            });
        }
    }, []);

    // REMOVE API KEY HANDLER
    const removeApiKeyWhitelist = useCallback(async (id) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const {
                    data
                } = await axios.post(`${API_URL}/auth/User/RemoveWhitelist`, {
                    id
                });

                state.apiKeyData.whitelist = state.apiKeyData.whitelist.filter(item => item.id !== id);

                dispatch({
                    type: "REMOVEAPIKEYWHITELIST",
                    payload: {
                        apiKeyData: state.apiKeyData,
                        apiKeyWhitelistData: data
                    }
                });
            }
            catch {
                alert("Remove error!");
            }
        }
    }, [state.apiKeyData]);

    // EFFECT CHECK TOKEN
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: {
                    cardData: null,
                }
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <ApiKeysContext.Provider value={{
        ...state,
        generateApiKey,
        switchStatusApiKey,
        removeApiKey,
        getApiKey,
        switchStatusApiKeyWhitelist,
        createApiKeyWhitelist,
        removeApiKeyWhitelist
    }}>
        {children}
    </ApiKeysContext.Provider>;
};