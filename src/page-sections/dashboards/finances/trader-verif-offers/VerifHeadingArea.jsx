// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import Emergency from "icons/Emergency";
import { useTranslation } from "react-i18next";

// ===================================================================

// ===================================================================

const VerifHeadingArea = () => {
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

            <Paragraph fontSize={16}>{t("Verification Orders")}</Paragraph>
        </FlexBox>
    </FlexBetween>;
};
export default VerifHeadingArea;