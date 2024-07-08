import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    cardsGroups: [],
    editCardGroupData: null,
    createCardGroupData: null,
    removeCardGroupData: null,
    groupId: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardsGroups: [],
                    editCardGroupData: null,
                    createCardGroupData: null,
                    groupId: null,
                };
            }
        case "UPDATECARDSGROUPS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    cardsGroups: action.payload.cardsGroups,
                };
            }
        case "CREATE":
            {
                return {
                    ...state,
                    isInitialized: true,
                    createCardGroupData: action.payload.data,
                };
            }
        case "EDIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    editCardGroupData: action.payload.data
                };
            }
        case "SETGROUPID":
            {
                return {
                    ...state,
                    isInitialized: true,
                    groupId: action.payload.groupId
                };
            }
        case "REMOVE":
            {
                return {
                    ...state,
                    isInitialized: true,
                    removeCardGroupData: action.payload.removeCardGroupData
                };
            }
        default:
            {
                return state;
            }
    }
};

export const GroupsCardsContext = createContext();

export const GroupsCardsProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // CREATE CARD GROUP HANDLER
    const createCardGroup = useCallback(async (values) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/AddCardGroup`, {
                cardGroup: {
                    id: "",
                    name: values.groupName,
                },
                fiatCards: values.cards.map(card => {
                    return {
                        id: "",
                        cardNumber: card.cardNumber.toString(),
                        cardHolder: card.cardHolder,
                        fiatCode: card.fiatCode,
                        fiatCardStatus: card.isActive ? 0 : 1,
                        groupProviderInfo: {
                            providerCode: card.groupProviderInfo.providerCode,
                            minOfferAmountLimit: Number(card.groupProviderInfo.minOfferAmountLimit),
                            maxOfferAmountLimit: Number(card.groupProviderInfo.maxOfferAmountLimit),
                            maxAmount: Number(card.groupProviderInfo.maxAmount)
                        }
                    }
                })
            });

            dispatch({
                type: "CREATE",
                payload: {
                    data: data
                }
            });
        }
    }, []);

    const resetCreateCardGroup = useCallback(async () => {
        dispatch({
            type: "CREATE",
            payload: {
                success: null
            }
        });
    }, []);

    // EDIT CARD GROUP HANDLER
    const editCardGroup = useCallback(async (values) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/EditCardGroup`, {
                cardGroup: {
                    id: values.id,
                    name: values.groupName,
                    fiatGroupStatus: values.fiatGroupStatus,
                },
                fiatCards: values.cards.map(card => {
                    return {
                        id: card.id ? card.id : "",
                        cardNumber: card.cardNumber.toString(),
                        cardHolder: card.cardHolder,
                        fiatCode: card.fiatCode,
                        fiatCardGroupId: card.fiatCardGroupId,
                        fiatCardStatus: card.isActive ? 0 : 1,
                        groupProviderInfo: {
                            providerCode: card.groupProviderInfo.providerCode,
                            minOfferAmountLimit: Number(card.groupProviderInfo.minOfferAmountLimit),
                            maxOfferAmountLimit: Number(card.groupProviderInfo.maxOfferAmountLimit),
                            maxAmount: Number(card.groupProviderInfo.maxAmount)
                        }
                    }
                })
            });

            dispatch({
                type: "EDIT",
                payload: {
                    data: data
                }
            });
        }
    }, []);

    const resetEditCardGroup = useCallback(async () => {
        dispatch({
            type: "EDIT",
            payload: {
                data: null
            }
        });
    }, []);

    // REMOVE CARD GROUP HANDLER
    const removeCardGroup = useCallback(async (cardGroupId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/trader/RemoveCardGroup`, {
                cardGroupId
            });

            dispatch({
                type: "REMOVE",
                payload: {
                    removeCardGroupData: data
                }
            });
        }
    }, []);
    
    // UPDATE CARDS GROUPS LIST HANDLER
    const updateCardsGroups = useCallback(async (param) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/trader/GetCardGroups`);

                dispatch({
                    type: "UPDATECARDSGROUPS",
                    payload: {
                        cardsGroups: data.cardGroups,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATECARDSGROUPS",
                    payload: {
                        cardsGroups: [],
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATECARDSGROUPS",
                payload: {
                    cardsGroups: [],
                }
            });
        }
    }, []);

    // SET CARD GROUP ID HANDLER
    const setGroupId = async (param) => {
        dispatch({
            type: "SETGROUPID",
            payload: {
                groupId: param,
            }
        });
    };

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
    return <GroupsCardsContext.Provider value={{
        ...state,
        createCardGroup,
        resetCreateCardGroup,
        editCardGroup,
        resetEditCardGroup,
        setGroupId,
        removeCardGroup,
        updateCardsGroups
    }}>
        {children}
    </GroupsCardsContext.Provider>;
};