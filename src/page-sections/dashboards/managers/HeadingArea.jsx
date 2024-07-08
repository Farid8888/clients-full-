import { Button } from "@mui/material";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import GroupSenior from "icons/GroupSenior";
import Add from "icons/Add";

// ===================================================================

// ===================================================================

const HeadingArea = ({
  value,
  changeTab
}) => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();

  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper sx={{ bgcolor: "transparent" }}>
          <GroupSenior sx={{
          color: "primary.main"
        }} />
        </IconWrapper>

        <Paragraph fontSize={16}>{t("My Managers")}</Paragraph>
      </FlexBox>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/managers/add")}>
        {t("Add New Manager")}
      </Button>
    </FlexBetween>;
};
export default HeadingArea;