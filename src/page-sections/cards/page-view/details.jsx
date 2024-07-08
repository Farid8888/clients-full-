import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import CardView from "../CardView";

const CardDetailsPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <CardView />
            </Grid>
        </Grid>
    </Box>;
};
export default CardDetailsPageView;