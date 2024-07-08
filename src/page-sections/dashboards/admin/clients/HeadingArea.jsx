import { TabContext, TabList } from "@mui/lab";
import { Button, styled, Tab } from "@mui/material";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import GroupSenior from "icons/GroupSenior";
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
  changeTab
}) => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  
  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper style={{ backgroundColor: "transparent" }}>
          <GroupSenior sx={{
          color: "primary.main"
        }} />
        </IconWrapper>

        <Paragraph fontSize={16}>{t("Clients")}</Paragraph>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label={t("All Clients")} value="" />
        </TabListWrapper>
      </TabContext>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/admin/add-user?role=Client")}>
        {t("Add New Client")}
      </Button>
    </FlexBetween>;
};
export default HeadingArea;