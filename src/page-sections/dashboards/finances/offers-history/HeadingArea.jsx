import { TabContext, TabList } from "@mui/lab";
import { styled, Tab } from "@mui/material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import Emergency from "icons/Emergency";
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
    changeTab
}) => {
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

            <Paragraph fontSize={16}>{t("History Orders")}</Paragraph>
        </FlexBox>

        <TabContext value={value}>
            <TabListWrapper variant="scrollable" onChange={changeTab}>
                <Tab disableRipple label={t("Buy")} value="0" />
                <Tab disableRipple label={t("Sell")} value="1" />
            </TabListWrapper>
        </TabContext>

        <FlexBox alignItems="center" sx={{ width: 1 / 7 }}></FlexBox>
    </FlexBetween>;
};
export default HeadingArea;