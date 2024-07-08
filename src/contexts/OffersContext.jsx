import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    offerData: null,
    offersList: [],
    traderOffersList: [],
    adminOffersListBuy: [],
    adminOffersListSell: []
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    offersList: action.payload.offersList,
                    traderOffersList: action.payload.traderOffersList,
                    offerData: action.payload.offerData,
                    adminOffersListBuy: [],
                    adminOffersListSell: [],
                };
            }
        case "CREATE":
            {
                return {
                    ...state,
                    isInitialized: true,
                    offerData: action.payload.offerData,
                };
            }
        case "UPDATEOFFERS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    offersList: action.payload.offersList,
                };
            }
        case "UPDATETRADEROFFERS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    traderOffersList: action.payload.offersList,
                };
            }
        case "UPDATEADMINOFFERSBUY":
            {
                return {
                    ...state,
                    isInitialized: true,
                    adminOffersListBuy: action.payload.offersList,
                };
            }
        case "UPDATEADMINOFFERSSELL":
            {
                return {
                    ...state,
                    isInitialized: true,
                    adminOffersListSell: action.payload.offersList,
                };
            }
        case "UPDATEADMINVERIFICATION":
            {
                return {
                    ...state,
                    info: action.payload.info,
                };
            }
        case "ACCEPT":
        case "ACCEPTGROUP":
        case "ACCEPTCLIENTAMOUNT":
        case "CANCEL":
        case "CANCELGROUP":
        case "COMPLETE":
        case "UPDATE":
        case "CHANGEOFFERSTATUS":
            {
                return {
                    ...state,
                    isInitialized: true,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const OffersContext = createContext();

export const OffersProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // CREATE OFFER HANDLER
    const createOffer = useCallback(async (amountFiat, tokenCode, type, fiatCode, cardNumber, cardHolder, providerCode) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trade/createOffer`, {
                    amountFiat,
                    "fiatInfo": {
                        providerCode,
                        fiatCode,
                        cardNumber,
                        cardHolder
                    },
                    tokenCode,
                    type
                });

                dispatch({
                    type: "CREATE",
                    payload: {
                        offerData: data
                    }
                });
            }
        }
        catch (err) {
            dispatch({
                type: "CREATE",
                payload: {
                    offerData: null
                }
            });
        }
    }, []);
    
    // ACCEPT CLIENT AMOUNT OFFER HANDLER
    const acceptClientAmountOffer = useCallback(async(offerId, isAccept) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/acceptClientAmountOffer`, {
                offerId,
                isAccept
            });
            dispatch({
                type: "ACCEPTCLIENTAMOUNT",
                payload: {}
            });
        }
    }, []);
    
    // ACCEPT OFFER HANDLER
    const acceptOffer = useCallback(async (offerId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/acceptOffer`, {
                offerId
            });
            dispatch({
                type: "ACCEPT",
                payload: {}
            });
        }
    }, []);

    // ACCEPT OFFER HANDLER
    const acceptGroupOffer = useCallback(async (humanId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/acceptOffer`, {
                humanId
            });
            dispatch({
                type: "ACCEPTGROUP",
                payload: {}
            });
        }
    }, []);

    // CANCEL OFFER HANDLER
    const cancelOffer = useCallback(async (offerId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/cancelOffer`, {
                offerId
            });
            dispatch({
                type: "CANCEL",
                payload: {}
            });
        }
    }, []);

    // CANCEL OFFER HANDLER
    const cancelGroupOffer = useCallback(async (humanId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/cancelOffer`, {
                humanId
            });
            dispatch({
                type: "CANCELGROUP",
                payload: {}
            });
        }
    }, []);
    
    // COMPLETE OFFER HANDLER
    const completeOffer = useCallback(async (offerId, amountFiat) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/completeOffer`, {
                offerId,
                amountFiat
            });
            dispatch({
                type: "COMPLETE",
                payload: {}
            });
        }
    }, []);

    // UPDATE OFFER HANDLER
    const updateOfferAmount = useCallback(async (offerId, amountFiat) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/updateOfferAmount`, {
                offerId,
                amountFiat
            });
            dispatch({
                type: "UPDATE",
                payload: {}
            });
        }
    }, []);
    
    // CHANGE OFFER STATUS HANDLER
    const changeOfferStatus = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trade/admin/changeOfferStatus`, param);
            dispatch({
                type: "CHANGEOFFERSTATUS",
                payload: {}
            });
        }
    }, []);

    // UPDATE OFFERS LIST HANDLER
    const updateOffers = useCallback(async (param) => {
        try {
            if (param === null) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trade/offersList`, param);
                
                dispatch({
                    type: "UPDATEOFFERS",
                    payload: {
                        offersList: data.offers,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATEOFFERS",
                    payload: {
                        offersList: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATEOFFERS",
                payload: {
                    offersList: [],
                }
            });
        }
    }, []);

    // UPDATE TRADER OFFERS LIST HANDLER
    const updateTraderOffers = useCallback(async (param) => {
        try {
            if (param === null) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trade/offersList`, param);
                
                dispatch({
                    type: "UPDATETRADEROFFERS",
                    payload: {
                        offersList: data.offers,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATETRADEROFFERS",
                    payload: {
                        offersList: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATETRADEROFFERS",
                payload: {
                    offersList: [],
                }
            });
        }
    }, []);

    // UPDATE ADMIN OFFERS LIST HANDLER
    const updateAdminOffers = useCallback(async (param) => {
        try {
            if (param === null || param.offerTypes.length === 0) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trade/offersList`, param);

                updateAdminState(param.offerTypes[0], data.offers);
            } else {
                updateAdminState(param.offerTypes[0], []);
            }
        } catch (err) {
            updateAdminState(param.offerTypes[0], []);
        }
    }, []);

    const updateAdminVerifications = useCallback(async (param) => {
        try {
            if (param === null) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/verification/admin/getVerifications`);

                updateAdminState(param.offerTypes[0], data.verificationOffers.filter(o => o.type === param.offerTypes[0]));
            } else {
                updateAdminState(param.offerTypes[0], []);
            }
        } catch (err) {
            updateAdminState(param.offerTypes[0], []);
        }
    }, []);

    const completeVerification = useCallback(async (param) => {
        var info = null;
        try {
            if (param === null) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/verification/admin/completeVerification`, param);

                info = data;
            }
        } finally {
            dispatch({
                type: "UPDATEADMINVERIFICATION",
                payload: {
                    info,
                }
            });
        }
    }, []);

    const updateAdminState = (offerType, data) => {
        switch (offerType) {
            case 0:
                dispatch({
                    type: "UPDATEADMINOFFERSBUY",
                    payload: {
                        offersList: data,
                    }
                });
                break;
            case 1:
                dispatch({
                    type: "UPDATEADMINOFFERSSELL",
                    payload: {
                        offersList: data,
                    }
                });
                break;
            default:
                break;
        }
    };

    // EFFECT CHECK TOKEN
    useEffect(() => {
        (async () => {
            dispatch({
                type: "INIT",
                payload: {
                    offerData: null,
                    offersList: [],
                    traderOffersList: [],
                }
            });
        })();
    }, []);

    // show loading until not initialized
    if (!state.isInitialized) return <LoadingProgress />;
    return <OffersContext.Provider value={{
        ...state,
        createOffer,
        updateOffers,
        acceptClientAmountOffer,
        acceptOffer,
        acceptGroupOffer,
        cancelOffer,
        cancelGroupOffer,
        updateTraderOffers,
        completeOffer,
        updateAdminOffers,
        completeVerification,
        changeOfferStatus,
        updateOfferAmount,
        updateAdminVerifications
    }}>
        {children}
    </OffersContext.Provider>;
};