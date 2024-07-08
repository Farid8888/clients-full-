import { useState, useEffect } from "react";
import { Box, Card, styled, Switch } from "@mui/material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { H6, Paragraph } from "components/typography";
// CUSTOM UTILS METHODS
import { isDark } from "utils/constants";
import { numberFormat } from "utils/numberFormat";

// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import { CryptoProvider } from "contexts/CryptoContext";
import RefillCryptoModal from "./crypto-balance/RefillCryptoModal";

// STYLED COMPONENTS
const StyledCard = styled(Card)(({
  theme
}) => ({
  border: 0,
  padding: 3,
  position: "relative",
  background: "linear-gradient(103.35deg, #FFFFFF 63.76%, #EDEAFF 98.71%)",
  ...(isDark(theme) && {
    background: "auto"
  })
}));

const Balance = () => {
  const {
    user,
    roleName,
    switchOnline,
    switchSuccess,
    resetSwitchSuccess,
    getReservedAmount,
    balanceLimit,
    reservedAmount
  } = useAuth();

  const [isChecked, setIsChecked] = useState(user ? user.isOnline : false);

  const {
    t
  } = useTranslation();

  useEffect(() => {
    async function fetchBalance() {
      await getReservedAmount();
    };

    const intervalId = setInterval(() => {
      fetchBalance()
    }, 1000 * 10); // in milliseconds

    return () => clearInterval(intervalId)
  }, [getReservedAmount]);

  const handleChange = () => {
      switchOnline();
  };

  useEffect(() => {
      if (user && isChecked !== user.isOnline) {
        setIsChecked(user.isOnline);
      }

      if (switchSuccess) {
          resetSwitchSuccess(user);
      }
  }, [isChecked, resetSwitchSuccess, switchSuccess, user]);

  return user && <StyledCard>
      <Box p={3}>
        <FlexBox alignItems="center" gap={2} py={4}>
            <Box>
                <H6 lineHeight={1} fontSize={28} fontWeight={600}>
                  {numberFormat(user.balance)}$
                </H6>

                <Paragraph color="text.secondary">{t("My Balance")}</Paragraph>

                <H6 lineHeight={1} fontSize={28} fontWeight={600} mt={1}>
                    {numberFormat((balanceLimit ? balanceLimit : 0))}$
                </H6>

                <Paragraph color="text.secondary">{t("My Balance Limit")}</Paragraph>
            </Box>

            <Box ml={3}>
                <H6 lineHeight={1} fontSize={28} fontWeight={600}>
                  {numberFormat(reservedAmount)}$
                </H6>

                <Paragraph color="text.secondary">{t("Reserved Balance")}</Paragraph>
            </Box>
        </FlexBox>

        <FlexBox alignItems="center" gap={2} py={4}>
            <CryptoProvider><RefillCryptoModal user={user} /></CryptoProvider>
        </FlexBox>

        {roleName && roleName === "Trader" && <FlexBox>
          <Box>
            <Paragraph fontSize={20} fontWeight={500}>{t("Online")}</Paragraph>
          </Box>

          <Switch checked={isChecked} onChange={handleChange} />
        </FlexBox>}
      </Box>
    </StyledCard>;
};

export default Balance;