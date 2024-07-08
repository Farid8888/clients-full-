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

// ===================================================================

// ===================================================================

const VerifHeadingArea = ({ offerType }) => {
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

            <Paragraph fontSize={16}>{offerType === 0 ? t("Verification Buy Offers") : t("Verification Sell Offers")}</Paragraph>
        </FlexBox>

        {/*<TabContext value={value}>*/}
        {/*    <TabListWrapper variant="scrollable" onChange={changeTab}>*/}
        {/*        <Tab disableRipple label={t("Buy")} value="0" />*/}
        {/*        <Tab disableRipple label={t("Sell")} value="1" />*/}
        {/*    </TabListWrapper>*/}
        {/*</TabContext>*/}

        {/*{!isTrader && <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/add-offer")}>*/}
        {/*    {t("Add new order")}*/}
        {/*</Button>}*/}

        {/*{isTrader && <FlexBox alignItems="center" sx={{ width: 1/7}}></FlexBox>}*/}
    </FlexBetween>;
};
export default VerifHeadingArea;