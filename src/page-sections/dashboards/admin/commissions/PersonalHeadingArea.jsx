import { TabContext, TabList } from "@mui/lab";
import { Button, styled, Tab } from "@mui/material";
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
const PersonalHeadingArea = ({
  value,
  changeTab,
  providerCodes,
  isTraders
}) => {
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();

  const headTitle = isTraders ? "Commissions Traders" : "Commissions Clients";
  const role = isTraders ? "1" : "0";

  return <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper style={{backgroundColor: "transparent"}}>
          <MoneyIcon sx={{
          color: "primary.main"
        }} />
        </IconWrapper>

          <Paragraph fontSize={16}>{t(headTitle)}</Paragraph>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab disableRipple label="All Commissions" value="" />
              {providerCodes && providerCodes.map(code => <Tab disableRipple label={code} value={code} key={code} />)}
        </TabListWrapper>
      </TabContext>

      <Button variant="contained" startIcon={<Add />} onClick={() => navigate(`/dashboard/admin/add-personal-commission?role=${role}`)}>
          {t("Add Commission")}
      </Button>
    </FlexBetween>;
};
export default PersonalHeadingArea;