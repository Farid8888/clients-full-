import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    fiatProviders: [],
    tokenProviders: []
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    switchData: null
                };
            }
        case "UPDATEALLPROVIDERS":
            {
                let fiatProviders = action.payload.providers.filter(p => p.type === "FIAT");
                let tokenProviders = action.payload.providers.filter(p => p.type === "TOKEN");

                return {
                    ...state,
                    fiatProviders: fiatProviders,
                    tokenProviders: tokenProviders
                };
            }
        default:
            {
                return state;
            }
    }
}

export const PaymentProviderContext = createContext();

export const PaymentProviderProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // UPDATE ALL PROVIDERS HANDLER
    const updateAllProviders = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/paymentProviders/getAllProviders`);

                if (data.providers) {
                    dispatch({
                        type: "UPDATEALLPROVIDERS",
                        payload: {
                            providers: data.providers,
                        }
                    });
                }
            } else {
                dispatch({
                    type: "UPDATEALLPROVIDERS",
                    payload: {
                        providers: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATEALLPROVIDERS",
                payload: {
                    providers: []
                }
            });
        }
    }, []);

    // EFFECT INIT
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: {}
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;

    return <PaymentProviderContext.Provider value={{
        ...state,
        updateAllProviders
    }}>
        {children}
    </PaymentProviderContext.Provider>;
};