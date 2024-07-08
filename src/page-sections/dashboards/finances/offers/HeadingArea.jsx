import { TabContext, TabList } from "@mui/lab";
import { Button, styled, Tab, Hidden } from "@mui/material";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import Emergency from "icons/Emergency";
//import GroupSenior from "icons/GroupSenior";
import Add from "icons/Add";
import { useTranslation } from "react-i18next";

// STYLED COMPONENT
const TabListWrapper = styled(TabList)(({
    theme
}) => ({
    borderBottom: 0,
    [theme.breakpoints.down(727)]: {
        order: 3
    }
}));

// ===================================================================

// ===================================================================

const HeadingArea = ({
    value,
    changeTab,
    isTrader,
    isManager,
    isPersonal
}) => {
    const navigate = useNavigate();
    const {
        t
    } = useTranslation();

    return <FlexBetween flexWrap="wrap" gap={1}>
        <FlexBox alignItems="center">
            <IconWrapper sx={{ bgcolor: "transparent" }}>
                <Emergency sx={{
                    color: "primary.main"
                }} />
            </IconWrapper>

            <Paragraph fontSize={16}>{isPersonal ? t("My Orders") : t("Active Orders")}</Paragraph>
        </FlexBox>

        <TabContext value={value}>
            <TabListWrapper variant="scrollable" onChange={changeTab}>
                <Tab disableRipple label={t("Buy")} value="0" />
                {((isTrader && isPersonal) || !isTrader) && <Tab disableRipple label={t("Sell")} value="1" />}
            </TabListWrapper>
        </TabContext>

        {(!isTrader && !isManager) && <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/add-offer")}>
            {t("Add new order")}
        </Button>}

        {(isTrader || isManager) && <FlexBox alignItems="center" sx={{ width: 1/7}}></FlexBox>}
    </FlexBetween>;
};
export default HeadingArea;