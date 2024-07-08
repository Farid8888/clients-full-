import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import ClientsListPageView from "./clients-list";
import Footer from "../../../_common/Footer";
import { ClientsProvider } from "contexts/ClientsContext";

const ClientsPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            {/* COMMISSIONS LIST CARD */}
            <Grid item xs={12}>
                <ClientsProvider>
                    <ClientsListPageView />
                </ClientsProvider>
            </Grid>

            {/* FOOTER CARD */}
            <Grid item xs={12}>
               {/* <Footer />*/}
            </Grid>
        </Grid>
    </Box>;
};
export default ClientsPageView;