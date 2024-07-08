import { TabContext, TabList } from "@mui/lab";
import { styled, Tab, Button } from "@mui/material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { IconWrapper } from "components/icon-wrapper";
import { FlexBetween, FlexBox } from "components/flexbox";
// CUSTOM ICON COMPONENTS
import MoneyIcon from "icons/MoneyIcon";
import Add from "icons/Add";
import { useTranslation } from "react-i18next";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";

// STYLED COMPONENT
const TabListWrapper = styled(TabList)(({
  theme
}) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3
  }
}));
const HeadingArea = ({
  value,
  changeTab,
  providerCodes
}) => {
    const navigate = useNavigate();
    const {
        t
    } = useTranslation();

  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper style={{backgroundColor: "transparent"}}>
          <MoneyIcon sx={{
          color: "primary.main"
        }} />
        </IconWrapper>

          <Paragraph fontSize={16}>{t("Custom Commissions")}</Paragraph>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label="All Commissions" value="" />
              {providerCodes && providerCodes.map(code => <Tab disableRipple label={code} value={code} key={code} />)}
        </TabListWrapper>
      </TabContext>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate(`/dashboard/admin/add-custom-commission`)}>
          {t("Add Custom Commission")}
      </Button>
    </FlexBetween>;
};
export default HeadingArea;