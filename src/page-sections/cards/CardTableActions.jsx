import { styled, TextField/*, MenuItem, IconButton*/ } from "@mui/material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
//import FormatBullets from "icons/FormatBullets";
import { useTranslation } from "react-i18next";

//  STYLED COMPONENTS
const Wrapper = styled(FlexBox)(({
    theme
}) => ({
    alignItems: "center",
    ".select": {
        flex: "1 1 200px"
    },
    [theme.breakpoints.down(440)]: {
        ".navigation": {
            display: "none"
        }
    }
}));

// ==============================================================

// ==============================================================

const CardTableActions = ({
    handleChangeFilter,
    filter
}) => {
    const {
        t
    } = useTranslation();

    return <Wrapper gap={2} px={2} py={4}>

        <TextField fullWidth label={t("Search by card number")} value={filter.search} onChange={e => handleChangeFilter("search", e.target.value)} />

        {/*<FlexBox alignItems="center" className="navigation">*/}
        {/*    <IconButton>*/}
        {/*        <FormatBullets color="primary" />*/}
        {/*    </IconButton>*/}
        {/*</FlexBox>*/}
    </Wrapper>;
};
export default CardTableActions;