import { useState, createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    cryptoDeposits: [],
    cryptoTypes: [],
    refillInfo: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                };
            }
        case "UPDATETYPES":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cryptoTypes: action.payload.cryptoTypes,
                };
            }
        case "UPDATEREFILLINFO":
            {
                return {
                    ...state,
                    isInitialized: true,
                    refillInfo: action.payload.refillInfo,
                };
            }
        case "GETDEPOSITS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cryptoDeposits: action.payload.cryptoDeposits,
                };
            }
        case "REFILLDEPOSIT":
            {
                return {
                    ...state,
                    isInitialized: true
                };
            }
        case "CANCELREFILLDEPOSIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    refillInfo: null
                };
            }
        default:
            {
                return state;
            }
    }
};

export const CryptoContext = createContext();

export const CryptoProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // UPDATE CRYPTO TYPES HANDLER
    const updateTypes = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.get(`${API_URL}/crypto/GetCryptoTypes`);

            if (data.success) {
                dispatch({
                    type: "UPDATETYPES",
                    payload: {
                        cryptoTypes: data.cryptoTypes
                    }
                });
            }
        }
    }, []);

    // UPDATE CRYPTO RFILL HANDLER
    const updateRefillInfo = useCallback(async (addressId) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            const {
                data
            } = await axios.get(`${API_URL}/crypto/GetRefill?addressId=${addressId}`);
            
            if (data.success && data.address.length > 0) {
                dispatch({
                    type: "UPDATEREFILLINFO",
                    payload: {
                        refillInfo: data
                    }
                });
            } 
        }
    }, []);

    // GET DEPOSITS HANDLER
    const getCryptoDeposits = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            const {
                data
            } = await axios.get(`${API_URL}/crypto/GetUserDeposits`);

            dispatch({
                type: "GETDEPOSITS",
                payload: {
                    cryptoDeposits: data.success ? data.deposits : [],
                }
            });
        }
    }, []);

    // REFILL CRYPTO DEPOSIT HANDLER
    const refillCryptoDeposit = useCallback(async (cryptoTypeId, amount) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/crypto/RefillDeposit`, { cryptoTypeId, amount });

            dispatch({
                type: "REFILLDEPOSIT",
                payload: { }
            });
        }
    }, []);

    // CANCEL REFILL CRYPTO DEPOSIT HANDLER
    const cancelRefillCryptoDeposit = useCallback(async (depositId) => {
        const accessToken = localStorage.getItem("accessToken");
        const roleName = localStorage.getItem("roleName");
        const isTrader = roleName && (roleName === "Owner" || roleName === "Trader");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/crypto/CancelRefill`, { depositId });
            dispatch({
                type: "CANCELREFILLDEPOSIT",
                payload: { }
            });
        }
    }, []);

    // EFFECT CHECK TOKEN
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: { }
            });
            getCryptoDeposits();
        })();
    }, [getCryptoDeposits]);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <CryptoContext.Provider value={{
        ...state,
        updateTypes,
        getCryptoDeposits,
        refillCryptoDeposit,
        cancelRefillCryptoDeposit,
        updateRefillInfo
    }}>
        {children}
    </CryptoContext.Provider>;
};