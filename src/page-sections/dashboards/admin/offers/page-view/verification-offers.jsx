import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import VerificationOffersListPageView from "./verification-offers-list";
import { OffersProvider } from "contexts/OffersContext";

const VerifOffersPageView = ({ offerType }) => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            {/* COMMISSIONS LIST CARD */}
            <Grid item xs={12}>
                <OffersProvider>
                    <VerificationOffersListPageView offerType={offerType} />
                </OffersProvider>
            </Grid>
        </Grid>
    </Box>;
};
export default VerifOffersPageView;