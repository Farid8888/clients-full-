import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import TradersListPageView from "./traders-list";
import Footer from "../../../_common/Footer";
import { TradersProvider } from "contexts/TradersContext";

const TradersPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            {/* COMMISSIONS LIST CARD */}
            <Grid item xs={12}>
                <TradersProvider>
                    <TradersListPageView />
                </TradersProvider>
            </Grid>

            {/* FOOTER CARD */}
            <Grid item xs={12}>
                {/*<Footer />*/}
            </Grid>
        </Grid>
    </Box>;
};
export default TradersPageView;