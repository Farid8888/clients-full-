import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import CommissionsList from "../commissions-list";
import Footer from "../../../_common/Footer";
import { CommissionsProvider } from "contexts/CommissionsContext";
import DefaultCommissonsPageView from "../DefaultCommissonsPageView";

const CommissionsPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            <CommissionsProvider>
                {/* DEFAULT COMMISIONS CARD */}
                <Grid item xs={12}>
                    <DefaultCommissonsPageView />
                </Grid>

                {/* CUSTOM COMMISSIONS LIST CARD */}
                <Grid item xs={12}>
                    <CommissionsList />
                </Grid>
            </CommissionsProvider>

            {/* FOOTER CARD */}
            <Grid item xs={12}>
                {/*<Footer />*/}
            </Grid>
        </Grid>
    </Box>;
};
export default CommissionsPageView;