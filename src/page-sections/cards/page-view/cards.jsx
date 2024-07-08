import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import CardsGroupsListPageView from "./group-list";
import CardListPageView from "./list";

const CardsPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            {/* CARDS GROUPS */}
            <Grid item md={12} xs={12}>
                <CardsGroupsListPageView />
            </Grid>

            {/* CARDS LIST */}
            <Grid item md={12} xs={12}>
                <CardListPageView />
            </Grid>
        </Grid>
    </Box>;
};
export default CardsPageView;