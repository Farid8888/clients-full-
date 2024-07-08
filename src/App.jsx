import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline, StyledEngineProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// AUTH CONTEXT FILE
import { AuthProvider } from "contexts/jwtContext";
// RIGHT-TO-LEFT SUPPORT COMPONENT
import { RTL } from "components/rtl";
// ROUTES METHOD
import { routes } from "./routes";
// MUI THEME CREATION METHOD
import { createCustomTheme } from "./theme";
// SITE SETTINGS CUSTOM DEFINED HOOK
import useSettings from "hooks/useSettings";
// I18N FILE
import "./i18n";
// CURRENCIES CONTEXT FILE
import { CurrenciesProvider } from "contexts/CurrenciesContext";
// CARDS CONTEXT FILE
import { CardsProvider } from "contexts/CardsContext";
// GROUPS CARDS CONTEXT FILE
import { GroupsCardsProvider } from "contexts/GroupsCardsContext";
// APP CONTEXT FILE
import { AppProvider } from "contexts/AppContext";
// MANAGERS CONTEXT FILE
import { ManagersProvider } from "contexts/ManagersContext";
import { PaymentProviderProvider } from "./contexts/PaymentProviderContext";

const App = () => {
  const {
    settings
  } = useSettings();
  const theme = createCustomTheme(settings);
  // ROUTER CREATE
  const router = createBrowserRouter(routes());
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CurrenciesProvider>
              <CardsProvider>
                <GroupsCardsProvider>
                  <AppProvider>
                    <ManagersProvider>
                      <PaymentProviderProvider>
                        <RTL>
                          <CssBaseline />
                          <RouterProvider router={router} />
                        </RTL>
                      </PaymentProviderProvider>
                    </ManagersProvider>
                  </AppProvider>
                </GroupsCardsProvider>
              </CardsProvider>
            </CurrenciesProvider>
          </AuthProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </LocalizationProvider>;
};
export default App;