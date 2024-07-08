import { Box, Grid } from "@mui/material";
// CUSTOM PAGE SECTION COMPONENTS
import EditGroupCardPageView from "../CardGroupEdit";

const CardGroupEditPageView = () => {
    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <EditGroupCardPageView />
            </Grid>
        </Grid>
    </Box>;
};
export default CardGroupEditPageView;