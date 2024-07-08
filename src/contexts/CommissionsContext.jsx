import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    isInitialized: false,
    defaultCommissionsList: [],
    customCommissionsList: [],
    defaultCommissionData: null,
    customCommissionsData: null,
    personalCommissionsList: [],
    addPersonalCommissionData: null,
    personalCommissionData: null,
    deletePersonalCommissionData: null,
    personalCommissionAddData: null,
    commissionsProviders: {},
};

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            {
                return {
                    ...state,
                    isInitialized: true,
                    defaultCommissionsList: [],
                    customCommissionsList: [],
                    defaultCommissionData: null,
                    customCommissionsData: null,
                    personalCommissionsList: [],
                    addPersonalCommissionData: null,
                    personalCommissionData: null,
                    deletePersonalCommissionData: null,
                    commissionsProviders: {},
                };
            }
        case "UPDATEDEFAULTCOMMISSIONS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    defaultCommissionsList: action.payload.commissionsList,
                };
            }
        case "UPDATECUSTOMCOMMISSIONS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    customCommissionsList: action.payload.commissionsList,
                };
            }
        case "UPDATEPERSONALCOMMISSIONS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    personalCommissionsList: action.payload.personalCommissionsList,
                };
            }
        case "EDITDEFAULTCOMMISSION":
            {
                return {
                    ...state,
                    isInitialized: true,
                    defaultCommissionData: action.payload.commissionData,
                };
            }
        case "ADDCUSTOMCOMMISSION":
        case "EDITCUSTOMCOMMISSION":
            {
                return {
                    ...state,
                    isInitialized: true,
                    customCommissionsData: action.payload.commissionData,
                };
            }
        case "DELETECUSTOMCOMMISSION":
            {
                return {
                    ...state,
                    customCommissionsList: state.customCommissionsList.filter(c => c.id !== action.payload.id),
                    isInitialized: true,
                    customCommissionsData: action.payload.commissionData,
                };
            }
        case "ADDPERSONALCOMMISSION":
            {
                return {
                    ...state,
                    isInitialized: true,
                    addPersonalCommissionData: action.payload.addPersonalCommissionData,
                };
            }
        case "EDITPERSONALCOMMISSION":
            {
                return {
                    ...state,
                    isInitialized: true,
                    personalCommissionData: action.payload.personalCommissionData,
                };
            }
        case "DELETEPERSONALCOMMISSION":
            {
                return {
                    ...state,
                    isInitialized: true,
                    deletePersonalCommissionData: action.payload.deletePersonalCommissionData,
                };
            }
        case "UPDATECOMMISSIONSPROVIDERS":
            {
                return {
                    ...state,
                    isInitialized: true,
                    commissionsProviders: action.payload.commissionsProviders,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const CommissionsContext = createContext();

export const CommissionsProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // EDIT DEFAULT COMMISSION HANDLER
    const editDefaultCommission = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/editDefaultCommission`, {
                id: param.id,
                percentClient: parseFloat(param.percentClient),
                percentOur: parseFloat(param.percentOur)
            });

            dispatch({
                type: "EDITDEFAULTCOMMISSION",
                payload: {
                    commissionData: data
                }
            });
        }
    }, []);

    // EDIT CUSTOM COMMISSION HANDLER
    const editCustomCommission = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/editCustomCommission`, {
                ...param,
                percentClient: parseFloat(param.percentClient),
                percentOur: parseFloat(param.percentOur)
            });

            dispatch({
                type: "EDITCUSTOMCOMMISSION",
                payload: {
                    commissionData: data
                }
            });
        }
    }, []);

    // ADD CUSTOM COMMISSION HANDLER
    const addCustomCommission = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/addCustomCommission`, {
                offerType: param.offerType,
                percentClient: parseFloat(param.percentClient),
                percentOur: parseFloat(param.percentOur),
                providerCode: param.providerCode,
                tokenCode: param.tokenCode
            });

            dispatch({
                type: "ADDCUSTOMCOMMISSION",
                payload: {
                    commissionData: data
                }
            });
        }
    }, []);

    // DELETE CUSTOM COMMISSION HANDLER
    const deleteCustomCommission = useCallback(async (id) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/deleteCustomCommission`, {
                id: id
            });

            dispatch({
                type: "DELETECUSTOMCOMMISSION",
                payload: {
                    id: id,
                    commissionData: data
                }
            });
        }
    }, []);

    // RESET CUSTOM COMMISSION HANDLER
    const resetCustomCommissionData = useCallback(async (id) => {
        dispatch({
            type: "ADDCUSTOMCOMMISSION",
            payload: {
                commissionData: null
            }
        });
    }, []);

    // UPDATE DEFAULT COMMISSIONS HANDLER
    const updateDefaultCommissions = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/commission/admin/getDefaultCommissions`);

                dispatch({
                    type: "UPDATEDEFAULTCOMMISSIONS",
                    payload: {
                        commissionsList: data.commissions,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATEDEFAULTCOMMISSIONS",
                    payload: {
                        commissionsList: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATEDEFAULTCOMMISSIONS",
                payload: {
                    commissionsList: []
                }
            });
        }
    }, []);

    // UPDATE CUSTOM COMMISSIONS HANDLER
    const updateCustomCommissions = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/commission/admin/getCustomCommissions`);

                dispatch({
                    type: "UPDATECUSTOMCOMMISSIONS",
                    payload: {
                        commissionsList: data.comissions,
                    }
                });
            } else {
                dispatch({
                    type: "UPDATECUSTOMCOMMISSIONS",
                    payload: {
                        commissionsList: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATECUSTOMCOMMISSIONS",
                payload: {
                    commissionsList: []
                }
            });
        }
    }, []);

    // ADD PERSONAL COMMISSION HANDLER
    const addPersonalCommission = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/addPersonalCommission`, {
                userId: param.userId,
                userType: param.userType,
                offerType: param.offerType,
                percent: parseFloat(param.percent),
                providerCode: param.providerCode,
                tokenCode: param.tokenCode
            });

            dispatch({
                type: "ADDPERSONALCOMMISSION",
                payload: {
                    addPersonalCommissionData: data
                }
            });
        }
    }, []);

    // EDIT PERSONAL COMMISSION HANDLER
    const editPersonalCommission = useCallback(async (param) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/editPersonalCommission`, {
                id: param.id,
                percent: parseFloat(param.percent)
            });

            dispatch({
                type: "EDITPERSONALCOMMISSION",
                payload: {
                    personalCommissionData: data
                }
            });
        }
    }, []);

    // DELETE PERSONAL COMMISSION HANDLER
    const deletePersonalCommission = useCallback(async (id) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/commission/admin/deletePersonalCommission`, {
                id,
            });

            dispatch({
                type: "DELETEPERSONALCOMMISSION",
                payload: {
                    deletePersonalCommissionData: data
                }
            });
        }
    }, []);
    
    // UPDATE PERSONAL COMMISSIONS HANDLER
    const updatePersonalCommissions = useCallback(async (isTraders) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/commission/admin/getPersonalCommissions?isTraders=${isTraders}`);

                if (data.success) {
                    dispatch({
                        type: "UPDATEPERSONALCOMMISSIONS",
                        payload: {
                            personalCommissionsList: data.commissions,
                        }
                    });
                }
            } else {
                dispatch({
                    type: "UPDATEPERSONALCOMMISSIONS",
                    payload: {
                        personalCommissionsList: []
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATEPERSONALCOMMISSIONS",
                payload: {
                    personalCommissionsList: []
                }
            });
        }
    }, []);

    // UPDATE COMMISSIONS PROVIDERS HANDLER
    const updateCommissionsProviders = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const {
                    data
                } = await axios.get(`${API_URL}/paymentProviders/getProvidersByToken`);

                if (data.success) {
                    dispatch({
                        type: "UPDATECOMMISSIONSPROVIDERS",
                        payload: {
                            commissionsProviders: data.providers,
                        }
                    });
                }
            } else {
                dispatch({
                    type: "UPDATECOMMISSIONSPROVIDERS",
                    payload: {
                        commissionsProviders: {}
                    }
                });
            }
        } catch (err) {
            dispatch({
                type: "UPDATECOMMISSIONSPROVIDERS",
                payload: {
                    commissionsProviders: {}
                }
            });
        }
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
    return <CommissionsContext.Provider value={{
        ...state,
        updateDefaultCommissions,
        updateCustomCommissions,
        editDefaultCommission,
        editCustomCommission,
        addCustomCommission,
        deleteCustomCommission,
        resetCustomCommissionData,
        updatePersonalCommissions,
        addPersonalCommission,
        editPersonalCommission,
        deletePersonalCommission,
        updateCommissionsProviders
    }}>
        {children}
    </CommissionsContext.Provider>;
};