import { Button, styled, Tab, Hidden } from "@mui/material";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import Emergency from "icons/Emergency";
import { useTranslation } from "react-i18next";

// ===================================================================

// ===================================================================

const HeadingArea = ({ offerType }) => {
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

            <Paragraph fontSize={16}>{offerType === 0 ? t("Buy Offers") : t("Sell Offers")}</Paragraph>
        </FlexBox>
    </FlexBetween>;
};
export default HeadingArea;