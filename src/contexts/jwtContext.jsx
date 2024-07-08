import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from "components/loader";

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
  isAuthenticated: false,
  isTfaEnabled: false,
  isInitialized: false,
  user: null,
  userName: null,
  email: null,
  roleName: null,
  password: null,
  switchSuccess: null,
  balanceLimit: 0,
  reservedAmount: 0,
  resetPasswordData: null,
  tfAppProvider: null,
  tfAppErrors: null,
};

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    //FOR NGROK CONNECTION
    //axios.defaults.headers.common["ngrok-skip-browser-warning"] = 69420;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const setUserName = username => {
    if (username) {
        localStorage.setItem("userName", username);
    } else {
        localStorage.removeItem("userName");
    }
};

const setRoleName = roleName => {
    if (roleName) {
        localStorage.setItem("roleName", roleName);
    } else {
        localStorage.removeItem("roleName");
    }
};

const setEmail = email => {
    if (email) {
        localStorage.setItem("email", email);
    } else {
        localStorage.removeItem("email");
    }
};

const setId = user => {
    if (user) {
        localStorage.setItem("userId", user);
    } else {
        localStorage.removeItem("userId");
    }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      {
        return {
          ...state,
          isInitialized: true,
          user: action.payload.user,
          isAuthenticated: action.payload.isAuthenticated,
          isTfaEnabled: action.payload.isTfaEnabled,
          userName: action.payload.userName,
          email: action.payload.email,
          roleName: action.payload.roleName,
          balanceLimit: 0,
          reservedAmount: 0,
          password: null,
          tfAppProvider: null,
          tfAppErrors: null
        };
      }
    case "LOGIN":
      {
        return {
          ...state,
          isAuthenticated: action.payload.isAuthenticated,
          isTfaEnabled: action.payload.isTfaEnabled,
          user: null,
          userName: action.payload.userName,
          email: action.payload.email,
          roleName: action.payload.roleName,
          password: action.payload.password,
          tfAppProvider: action.payload.tfAppProvider,
          tfAppErrors: null
        };
      }
    case "TFAPPERRORS":
      {
        return {
          ...state,
          tfAppErrors: action.payload.tfAppErrors
        };
      }
    case "LOGOUT":
      {
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          isTfaEnabled: false,
          userName: null,
          email: null,
          roleName: null,
          tfAppProvider: null,
          tfAppErrors: null
        };
      }
    case "REGISTER":
      {
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
        };
      }
    case "GETRESERVEDAMOUNT":
      {
        return {
          ...state,
            user: {
                ...state.user,
                balance: action.payload.userBalance
            },
          balanceLimit: action.payload.balanceLimit,
          reservedAmount: action.payload.reservedAmount
        };
      }
    case "SWITCHONLINE":
      {
        return {
          ...state,
          switchSuccess: action.payload.success,
        };
      }
    case "RESETSWITCHSUCCESS":
      {
        return {
          ...state,
          user: action.payload.user,
          switchSuccess: action.payload.success,
        };
      }
    case "RESETPASSWORD":
      {
        return {
          ...state,
          resetPasswordData: action.payload.resetPasswordData
        };
      }
    default:
      {
        return state;
      }
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({
  children
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // UPDATE USER HANDLER
    const update = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        const roleName = localStorage.getItem("roleName");
        const userName = localStorage.getItem("userName");
        const email = localStorage.getItem("email");
        const isTrader = roleName && roleName === "Trader";

        if (roleName === "Owner") {
            if (accessToken) {
                setSession(accessToken);
                const userId = localStorage.getItem("userId");
                dispatch({
                    type: "INIT",
                    payload: {
                        user: { id: userId, userId: userId },
                        isAuthenticated: true,
                        isTfaEnabled: false,
                        roleName: roleName,
                        userName: userName,
                        email: email
                    }
                });
                return;
            } else {
                logout();
                dispatch({
                    type: "INIT",
                    payload: {
                        user: null,
                        isAuthenticated: false,
                        isTfaEnabled: false,
                        roleName: null,
                        userName: null,
                        email: null
                    }
                });
            }
        }

        try {
            if (accessToken) {
                setSession(accessToken);
                var endpoint = isTrader ? "/trader/GetTraderInfo" : "/client/GetClientInfo";
                const {
                    data
                } = await axios.get(`${API_URL}${endpoint}`);

                if (!data.id || (data.id && (data.id.length === 0 || !data.id.trim()))) {
                    logout();
                    dispatch({
                        type: "INIT",
                        payload: {
                            user: null,
                            isAuthenticated: false,
                            isTfaEnabled: false,
                            roleName: null,
                            userName: null,
                            email: null
                        }
                    });
                    return;
                }

                dispatch({
                    type: "INIT",
                    payload: {
                        user: data,
                        isAuthenticated: true,
                        isTfaEnabled: false,
                        roleName: roleName,
                        userName: userName,
                        email: email
                    }
                });
                await getReservedAmount();
            } else {
                logout();
                dispatch({
                    type: "INIT",
                    payload: {
                        user: null,
                        isAuthenticated: false,
                        isTfaEnabled: false,
                        roleName: null,
                        userName: null,
                        email: null
                    }
                });
            }
        } catch {
            logout();
            dispatch({
                type: "INIT",
                payload: {
                    user: null,
                    isAuthenticated: false,
                    isTfaEnabled: false,
                    roleName: null,
                    userName: null,
                    email: null
                }
            });
        }
    }, []);

  // USER LOGIN HANDLER
  const login = useCallback(async (username, password) => {
    const {
      data
    } = await axios.post(`${API_URL}/auth/User/Login`, {
      username,
      password
    });

    //Если ок входим в систему
    if (data.message === "Ok") {
      setSession(data.accessToken);
      setUserName(data.user.userName);
      setRoleName(data.user.roleName);
      setEmail(data.user.email);
      if (data.user.roleName === "Owner") {
        setId(data.user.id);
      }

      dispatch({
        type: "LOGIN",
        payload: {
          isAuthenticated: true,
          isTfaEnabled: false,
          userName: data.user.userName,
          roleName: data.user.roleName,
          email: data.user.email,
          password: null,
          tfAppProvider: null,
          tfAppErrors: null
        }
      });
      update();
    //Если в ответе есть проавайдеры 2фа то устанавливаем стейт для перехода к 2фа странице
    } else if (data.providers && data.providers.length > 0) {
        dispatch({
          type: "LOGIN",
          payload: {
            isAuthenticated: false,
            isTfaEnabled: true,
            userName: username,
            roleName: null,
            email: null,
            password: password,
            tfAppProvider: data.providers[0].value,
            tfAppErrors: null
          }
        });
    }
  }, [update]);

  // USER LOGIN TFA HANDLER
  const loginTFA = useCallback(async (code) => {
      try {
          const {
              data
          } = await axios.post(`${API_URL}/auth/User/LoginTFA`, {
              user: { userName: state.userName, password: state.password },
              provider: state.tfAppProvider,
              code,
          });

          if (data && data.message === "Ok") {
              setSession(data.accessToken);
              setUserName(data.user.userName);
              setRoleName(data.user.roleName);
              setEmail(data.user.email);
              dispatch({
                  type: "LOGIN",
                  payload: {
                      isAuthenticated: true,
                      isTfaEnabled: false,
                      userName: data.user.userName,
                      roleName: data.user.roleName,
                      email: data.user.email,
                      password: null,
                      tfAppProvider: null,
                      tfAppErrors: null
                  }
              });
              update();
          } else if (data) {
              dispatch({
                  type: "TFAPPERRORS",
                  payload: {
                      tfAppErrors: data.messaage
                  }
              });
          }
      }
      catch {
          dispatch({
              type: "TFAPPERRORS",
              payload: {
                  tfAppErrors: "Wrong code!"
              }
          });
      }
  }, [update, state]);

  const clearTfAppErrors = () =>{
    dispatch({
        type: "TFAPPERRORS",
        payload: {
            tfAppErrors: null
        }
    });
  };

  // USER REGISTER HANDLER
  const register = useCallback(async (name, email, password) => {
    const {
      data
    } = await axios.post(`${API_URL}/users`, {
      name,
      email,
      password
    });
    setSession(data.token);
    dispatch({
      type: "REGISTER",
      payload: {
        user: data
      }
    });
  }, []);

  // RESET PASSWORD HANDLER
  const resetPassword = useCallback(async (password) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        if (accessToken) {
            const {
                data
            } = await axios.post(`${API_URL}/Auth/User/ResetPassword`, {
                password
            });

            dispatch({
                type: "RESETPASSWORD",
                payload: {
                    resetPasswordData: data
                }
            });
        }
        else {
          logout();
          dispatch({
            type: "INIT",
            payload: {
              user: null,
              isAuthenticated: false,
              isTfaEnabled: false,
              roleName: null,
              userName: null,
              email: null
            }
          });
        }
      }
      catch {
        logout();
        dispatch({
          type: "INIT",
          payload: {
            user: null,
            isAuthenticated: false,
            isTfaEnabled: false,
            roleName: null,
            userName: null,
            email: null
          }
        });
      }
  }, []);

  const updateResetPasswordData = useCallback(async () => {
      dispatch({
          type: "RESETPASSWORD",
          payload: {
              resetPasswordData: null
          }
      });
  }, []);

  // SWITCH ONLINE HANDLER
  const switchOnline = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            if (accessToken) {
                const {
                    data
                } = await axios.post(`${API_URL}/trader/SwitchIsOnline`, {});

                dispatch({
                    type: "SWITCHONLINE",
                    payload: {
                        success: data.success
                    }
                });
            } else {
                logout();
                dispatch({
                    type: "INIT",
                    payload: {
                        user: null,
                        isAuthenticated: false,
                        isTfaEnabled: false,
                        roleName: null,
                        userName: null,
                        email: null
                    }
                });
            }
        } catch {
            logout();
            dispatch({
                type: "INIT",
                payload: {
                    user: null,
                    isAuthenticated: false,
                    isTfaEnabled: false,
                    roleName: null,
                    userName: null,
                    email: null
                }
            });
        }
  }, []);

  // RESERVED AMOUNT HANDLER
  const getReservedAmount = useCallback(async (name, email, password) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        try {
            const {
                data
            } = await axios.get(`${API_URL}/trade/getReservedAmount`);

            dispatch({
                type: "GETRESERVEDAMOUNT",
                payload: {
                    userBalance: data.balance,
                    balanceLimit: data.balanceLimit,
                    reservedAmount: data.frozenBalance
                }
            });
        }
        catch {
            logout();
            dispatch({
                type: "INIT",
                payload: {
                    user: null,
                    isAuthenticated: false,
                    isTfaEnabled: false,
                    roleName: null,
                    userName: null,
                    email: null
                }
            });
        }
    }
  }, []);

    // RESET SWITCH SUCCESS HANDLER
    const resetSwitchSuccess = useCallback(async (user) => {
        let newUser = {
            ...user,
            isOnline: !user.isOnline
        }

        dispatch({
            type: "RESETSWITCHSUCCESS",
            payload: {
                user: newUser,
                success: null
            }
        });
    }, []);

  // USER LOGOUT HANDLER
  const logout = () => {
    setSession(null);
    setRoleName(null);
    setUserName(null);
    setEmail(null);

    dispatch({
      type: "LOGOUT"
    });
  };

  // EFFECT CHECK TOKEN
  useEffect(() => {
    (() => {
      try {
        update();
      } catch (err) {
        logout();
        dispatch({
            type: "INIT",
            payload: {
                user: null,
                isAuthenticated: false,
                isTfaEnabled: false,
                roleName: null,
                userName: null,
                email: null
            }
        });
      }
      })();
  }, [dispatch, update]);

  // show loading until not initialized
  if (!state.isInitialized) return <LoadingProgress />;
  return <AuthContext.Provider value={{
    ...state,
    method: "JWT",
    login,
    loginTFA,
    clearTfAppErrors,
    register,
    logout,
    switchOnline,
    resetSwitchSuccess,
    getReservedAmount,
    resetPassword,
    updateResetPasswordData
  }}>
      {children}
    </AuthContext.Provider>;
};