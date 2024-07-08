import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    offerVerificationData: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    offerVerificationData: action.payload.offerVerificationData,
                };
            }
        case "SENDVERIFICATION":
            {
                return {
                    ...state,
                    isInitialized: true,
                    offerVerificationData: action.payload.offerVerificationData,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const OfferVerificationContext = createContext();

export const OfferVerificationProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // CREATE OFFER HANDLER
    const sendVerificationOffer = useCallback(async (form) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.postForm(`${API_URL}/api/TradeVerification/UploadVerification`, form);

                dispatch({
                    type: "SENDVERIFICATION",
                    payload: {
                        offerVerificationData: data
                    }
                });
            }
        }
        catch (err) {
            dispatch({
                type: "SENDVERIFICATION",
                payload: {
                    offerVerificationData: null
                }
            });
        }
    }, []);

    // EFFECT CHECK TOKEN
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: {
                    offerVerificationData: null
                }
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <OfferVerificationContext.Provider value={{
        ...state,
        sendVerificationOffer,
    }}>
        {children}
    </OfferVerificationContext.Provider>;
};