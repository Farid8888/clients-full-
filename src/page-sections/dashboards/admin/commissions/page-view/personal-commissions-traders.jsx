import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import PersonalCommissionsList from "../personal-commissions-list";
import Footer from "../../../_common/Footer";
import { CommissionsProvider } from "contexts/CommissionsContext";

const PersonalCommissionsTradersPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            {/* COMMISSIONS LIST CARD */}
            <Grid item xs={12}>
                <CommissionsProvider>
                    <PersonalCommissionsList isTraders={true} />
                </CommissionsProvider>
            </Grid>

            {/* FOOTER CARD */}
            <Grid item xs={12}>
                {/*<Footer />*/}
            </Grid>
        </Grid>
    </Box>;
};
export default PersonalCommissionsTradersPageView;