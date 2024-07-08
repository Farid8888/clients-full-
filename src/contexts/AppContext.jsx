import { createContext, useEffect, useReducer, useCallback } from "react";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const initialState = {
    isInitialized: false,
    userData: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    userData: null
                };
            }
        case "SETUSERDATA":
            {
                return {
                    ...state,
                    isInitialized: true,
                    userData: action.payload.userData,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const AppContext = createContext();

export const AppProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // SET USER DATA HANDLER
    const setUserData = useCallback(async (data) => {
        dispatch({
            type: "SETUSERDATA",
            payload: {
                userData: data
            }
        });
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
    return <AppContext.Provider value={{
        ...state,
        setUserData
    }}>
        {children}
    </AppContext.Provider>;
};