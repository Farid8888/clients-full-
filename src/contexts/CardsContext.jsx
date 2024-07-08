import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    cardData: null,
    cardsList: [],
    cardId: null,
    cardHistory: [],
    successEdit: null,
    providerData: [],
    cardsByGroup: [],
    ungroupedCards: []
};

const getNewProvidersArray = (providerData, index, item) => {
    const providerDataCopy = [...providerData];

    if (index in providerDataCopy) {
        providerDataCopy[index] = item;
    } else if (item) {
        let i = 0;
        while (i < index) {
            providerDataCopy.push(null);
            i++;
        }

        providerDataCopy.push(item);
    }

    return providerDataCopy;
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardData: null,
                    cardsList: [],
                    cardId: null,
                    cardHistory: [],
                    successEdit: null
                };
            }
        case "CREATE":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardData: action.payload.cardData,
                };
            }
        case "UPDATELIST":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardsList: action.payload.cardsList,
                };
            }
        case "SETCARDID":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardId: action.payload.cardId,
                };
            }
        case "UPDATECARDHISTORY":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardHistory: action.payload.cardHistory,
                };
            }
        case "EDIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    successEdit: action.payload.success
                };
            }
        case "REMOVE":
            {
                return {
                    ...state,
                    isInitialized: true,
                };
            }
        case "CHECKPROVIDERCARD":
        case "REMOVEPROVIDERCARD":
            {
                let newProviderData = getNewProvidersArray(state.providerData, action.payload.providerDataIndex, action.payload.providerData);

                return {
                    ...state,
                    isInitialized: true,
                    providerData: newProviderData
                };
            }
        case "UPDATECARDSBYGROUP":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardsByGroup: action.payload.cardsByGroup
                };
            }
        case "UPDATEUNGROUPEDCARDS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    ungroupedCards: action.payload.ungroupedCards
                };
            }
        default:
            {
                return state;
            }
    }
};

export const CardsContext = createContext();

export const CardsProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // CREATE CARD HANDLER
    const createCard = useCallback(async (values) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/AddFiatCard`, {
                fiatCards: [{
                    id: "",
                    fiatCode: values.fiatCode,
                    cardNumber: values.cardNumber.toString(),
                    cardHolder: values.cardHolder,
                    traderId: values.traderId,
                    fiatCardStatus: values.fiatCardStatus,
                    fiatCardGroupId: values.fiatCardGroupId,
                    fiatCardGroupName: values.fiatCardGroupName
                }]
            });

            dispatch({
                type: "CREATE",
                payload: {
                    cardData: data
                }
            });
        }
    }, []);

    const resetCardData = useCallback(async () => {
        dispatch({
            type: "CREATE",
            payload: {
                cardData: null
            }
        });
    }, []);

    // EDIT CARD HANDLER
    const editCard = useCallback(async (values) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/EditFiatCard`, {
                fiatCards: [{
                    id: values.id,
                    fiatCode: values.fiatCode,
                    cardNumber: values.cardNumber.toString(),
                    cardHolder: values.cardHolder,
                    traderId: values.traderId,
                    fiatCardStatus: values.fiatCardStatus,
                    fiatCardGroupId: values.fiatCardGroupId,
                    fiatCardGroupName: values.fiatCardGroupName
                }]
            });

            if (data.success) {
                dispatch({
                    type: "EDIT",
                    payload: {
                        success: data.success
                    }
                });
            }
            else {
                dispatch({
                    type: "EDIT",
                    payload: {
                        success: false
                    }
                });
            }
        }
    }, []);

    const resetEdit = useCallback(async () => {
        dispatch({
            type: "EDIT",
            payload: {
                success: null
            }
        });
    }, []);

    // REMOVE CARD HANDLER
    const removeCard = useCallback(async (values, traderId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/RemoveFiatCard`, {
                traderId: traderId,
                fiatCardIds: values
            });
            dispatch({
                type: "REMOVE",
                payload: {}
            });
        }
    }, []);

    // UPDATE CARDS BY GROUP HANDLER
    const updateCardsByGroup = useCallback(async (groupId) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/trader/GetMyFiatCardsByGroup?groupId=${groupId}`);

                dispatch({
                    type: "UPDATECARDSBYGROUP",
                    payload: {
                        cardsByGroup: data.cards,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATECARDSBYGROUP",
                    payload: {
                        cardsByGroup: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATECARDSBYGROUP",
                payload: {
                    cardsByGroup: [],
                }
            });
        }
    }, []);

    // UPDATE UNGROUPED CARDS HANDLER
    const updateUngroupedCards = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/trader/GetMyFiatCardsByGroup`);

                dispatch({
                    type: "UPDATEUNGROUPEDCARDS",
                    payload: {
                        ungroupedCards: data.cards,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATEUNGROUPEDCARDS",
                    payload: {
                        ungroupedCards: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATEUNGROUPEDCARDS",
                payload: {
                    ungroupedCards: [],
                }
            });
        }
    }, []);

    // RESET CARDS BY GROUP HANDLER
    const resetCardsByGroup = useCallback(async () => {
        dispatch({
            type: "UPDATECARDSBYGROUP",
            payload: {
                cardsByGroup: [],
            }
        });
    }, []);

    // RESET UNGROUPED CARDS HANDLER
    const resetUngroupedCards = useCallback(async () => {
        dispatch({
            type: "UPDATEUNGROUPEDCARDS",
            payload: {
                ungroupedcards: [],
            }
        });
    }, []);

    // UPDATE CARDS LIST HANDLER
    const updateCards = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/trader/GetFiatCards`);

                dispatch({
                    type: "UPDATELIST",
                    payload: {
                        cardsList: data.cards,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATELIST",
                    payload: {
                        cardsList: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATELIST",
                payload: {
                    cardsList: [],
                }
            });
        }
    }, []);

    // UPDATE CARD HISTORY LIST HANDLER
    const updateCardHistory = useCallback(async (param) => {
        try {
            if (param === null) {
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trader/GetFiatHistory`, {
                    traderId: param.traderId,
                    fiatCardId: param.fiatCardId
                });
                dispatch({
                    type: "UPDATECARDHISTORY",
                    payload: {
                        cardHistory: data.fiatHistories,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATECARDHISTORY",
                    payload: {
                        cardHistory: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATECARDHISTORY",
                payload: {
                    cardHistory: [],
                }
            });
        }
    }, []);

    // SET CARD ID HANDLER
    const setCardId = async (param) => {
        dispatch({
            type: "SETCARDID",
            payload: {
                cardId: param,
            }
        });
    };

    // Check PROVIDER CARD HANDLER
    const checkProviderCard = useCallback(async (cardNumber, index) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trader/CheckFiatProvider`, {
                    cardNumber
                });

                dispatch({
                    type: "CHECKPROVIDERCARD",
                    payload: {
                        providerData: data,
                        providerDataIndex: index
                    }
                });
            } else {
                dispatch({
                    type: "CHECKPROVIDERCARD",
                    payload: {
                        providerData: null,
                        providerDataIndex: index
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "CHECKPROVIDERCARD",
                payload: {
                    providerData: null,
                    providerDataIndex: index
                }
            });
        }
    }, []);

    const clearProviderData = useCallback(async (index) => {
        dispatch({
            type: "REMOVEPROVIDERCARD",
            payload: {
                providerData: null,
                providerDataIndex: index
            }
        });
    }, []);

    // EFFECT CHECK TOKEN
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
    return <CardsContext.Provider value={{
        ...state,
        createCard,
        resetCardData,
        editCard,
        resetEdit,
        updateCards,
        setCardId,
        updateCardHistory,
        removeCard,
        checkProviderCard,
        clearProviderData,
        updateCardsByGroup,
        resetCardsByGroup,
        updateUngroupedCards,
        resetUngroupedCards
    }}>
        {children}
    </CardsContext.Provider>;
};