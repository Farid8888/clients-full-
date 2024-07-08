import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import OffersHistoryList from "./offers-history-list";
import { OffersProvider } from "contexts/OffersContext";

const OffersHistoryPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>

            {/* OFFERS HISTORY LIST CARD */}
            <Grid item xs={12}>
                <OffersProvider>
                    <OffersHistoryList />
                </OffersProvider>
            </Grid>
        </Grid>
    </Box>;
};
export default OffersHistoryPageView;