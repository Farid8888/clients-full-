import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
    currencies: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE":
            {
                return {
                    currencies: action.payload.currencies,
                };
            }
        default:
            {
                return state;
            }
    }
};

export const CurrenciesContext = createContext();

export const CurrenciesProvider = ({
    children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [firstFetch, setFirstFetch] = useState(true);

    // EFFECT CHECK TOKEN
    useEffect(() => {
        async function fetchCurrencies() {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const roleName = localStorage.getItem("roleName");

                var endpoint = roleName === "Trader" ? "/trader/GetMyRates" : "/client/GetMyRates";
                
                if (accessToken) {
                    const {
                        data
                    } = await axios.get(`${API_URL}${endpoint}?fiatCode=RUB`);
                    dispatch({
                        type: "UPDATE",
                        payload: {
                            currencies: data.currencyPairs,
                            isInitialized: data.success
                        }
                    });
                } else {
                    dispatch({
                        type: "UPDATE",
                        payload: {
                            currencies: null,
                        }
                    });
                }
            } catch (err) {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        currencies: null,
                    }
                });
            }
        };

        if (firstFetch) {
            fetchCurrencies();
            setFirstFetch(false);
        }

        const intervalId = setInterval(() => {
            fetchCurrencies();
        }, 1000 * 5) // in milliseconds
        return () => clearInterval(intervalId)
    }, [firstFetch]);

    return <CurrenciesContext.Provider value={{
        ...state,
    }}>
        {children}
    </CurrenciesContext.Provider>;
};