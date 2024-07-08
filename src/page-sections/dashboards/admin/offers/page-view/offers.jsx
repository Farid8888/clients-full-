import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import AdminOffersListPageView from "./admin-offers-list";
import { OffersProvider } from "contexts/OffersContext";

const OffersPageView = ({ offerType }) => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            {/* COMMISSIONS LIST CARD */}
            <Grid item xs={12}>
                <OffersProvider>
                    <AdminOffersListPageView offerType={offerType} />
                </OffersProvider>
            </Grid>
        </Grid>
    </Box>;
};
export default OffersPageView;