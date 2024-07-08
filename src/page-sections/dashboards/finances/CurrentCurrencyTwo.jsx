import { Card, Grid, Box, /*useTheme,*/ Stack } from "@mui/material";
import { AttachMoney, /*CurrencyPound, Euro*/ } from "@mui/icons-material";
import { nanoid } from "nanoid";
//import merge from "lodash.merge";
//import Chart from "react-apexcharts";
// CUSTOM COMPONENTS
import ListItem from "./shared/ListItem";
import { FlexBetween } from "components/flexbox";
import { Paragraph } from "components/typography";
// CUSTOM UTILS METHODS
//import { baseChartOptions } from "utils/baseChartOptions";
// CUSTOM DEFINED HOOK
import useCurrencies from "hooks/useCurrencies";
import useAuth from "hooks/useAuth";

import { useTranslation } from "react-i18next";
import { numberFormat } from "utils/numberFormat";

const CurrentCurrencyTwo = () => {
  //const theme = useTheme();
  
  const {
    user
  } = useAuth();
  const {
    currencies
  } = useCurrencies();

  const {
    t
  } = useTranslation();

    const DATA_CURRENT = [];
    const DATA_YOUR = [];

    //const max = currencies && currencies.reduce((prev, current) => ((prev?.CryptoInfo?.price > current?.CryptoInfo?.price) ?
    //    prev : current), 0);

    //var fiatBuyRate = user && max && max.fiatProviderInfo.fiatBuyRate;
    //var fiatSellRate = user && max && max.fiatProviderInfo.fiatSellRate;
    
    //max && DATA_YOUR.push({
    //    id: nanoid(),
    //    title: t("Buy") + " " + max.cryptoInfo.code + "-" + max.fiatCode + "(" + t("all directions") + ")",
    //    Icon: AttachMoney,
    //    value: fiatBuyRate
    //});

    //max && DATA_YOUR.push({
    //    id: nanoid(),
    //    title: t("Sell") + " " + max.cryptoInfo.code + "-" + max.fiatCode + "(" + t("all directions") + ")",
    //    Icon: AttachMoney,
    //    value: fiatSellRate
    //});

    // DATA SET
    user && currencies && currencies.map(({
        CryptoInfo,
        FiatCode,
        FiatProviderInfo,
    }) => {
        var fiatPermission = user.fiatPermissions && user.fiatPermissions
            .find(fp => fp.code === FiatProviderInfo.code);

        if (fiatPermission) {
            DATA_YOUR.push({
                id: nanoid(),
                title: t("Buy") + " " + CryptoInfo.code + "-" + FiatCode + "(" + FiatProviderInfo.name + ")(" + FiatProviderInfo.fiatBuyPercent + "%)",
                Icon: AttachMoney,
                value: FiatProviderInfo.fiatBuyRate
            });
            DATA_YOUR.push({
                id: nanoid(),
                title: t("Sell") + " " + CryptoInfo.code + "-" + FiatCode + "(" + FiatProviderInfo.name + ")(" + FiatProviderInfo.fiatSellPercent + "%)",
                Icon: AttachMoney,
                value: FiatProviderInfo.fiatSellRate
            });
        }

        return 0;
    });

    const allBanks = currencies && currencies.find(item => item.FiatProviderInfo.code === "default");

    if (allBanks) {
        DATA_CURRENT.push({
            id: nanoid(),
            title: allBanks.CryptoInfo.code + "-" + allBanks.FiatCode,
            Icon: AttachMoney,
            value: allBanks.CryptoInfo.price
        });

        DATA_CURRENT.push({
            id: nanoid(),
            title: t("Buy") + " " + allBanks.CryptoInfo.code + "-" + allBanks.FiatCode + "(" + allBanks.FiatProviderInfo.name + ")(" + allBanks.FiatProviderInfo.fiatBuyPercent + "%)",
            Icon: AttachMoney,
            value: allBanks.FiatProviderInfo.fiatBuyRate
        });
        DATA_CURRENT.push({
            id: nanoid(),
            title: t("Sell") + " " + allBanks.CryptoInfo.code + "-" + allBanks.FiatCode + "(" + allBanks.FiatProviderInfo.name + ")(" + allBanks.FiatProviderInfo.fiatSellPercent + "%)",
            Icon: AttachMoney,
            value: allBanks.FiatProviderInfo.fiatSellRate
        });
    }

  return <Card sx={{
    p: 3,
    height: "100%"
  }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paragraph mb={2} fontSize={18} fontWeight={500}>
            {t("Current Rates")}
          </Paragraph>

          <Stack spacing={2}>
            {DATA_CURRENT.map(({
            Icon,
            id,
            title,
            value
          }) => <FlexBetween key={id}>
                <ListItem title={title} Icon={<Icon fontSize="small" color={title === "EURO" ? "success" : title === "GBP" ? "warning" : "primary"} />} />

                <Box>
                  <Paragraph fontWeight={500}>{numberFormat(value)}</Paragraph>
                  {/*<Paragraph textAlign="end" color={value2 > 0 ? "success.500" : "error.main"}>*/}
                  {/*  {value2 > 0 && "+"}*/}
                  {/*  {value2}%*/}
                  {/*</Paragraph>*/}
                </Box>
              </FlexBetween>)}
          </Stack>
        </Grid>

        {/*<Grid item sm={6} xs={12}>*/}
        {/*  <Chart type="bar" series={chartSeries} options={chartOptions} height={180} />*/}
        {/*</Grid>*/}

        <Grid item xs={12}>
          <Paragraph mb={2} fontSize={18} fontWeight={500}>
            {t("Your Rates")}
          </Paragraph>

          <Stack spacing={2}>
            {DATA_YOUR.map(({
            Icon,
            id,
            title,
            value
          }) => <FlexBetween key={id}>
                <ListItem title={title} Icon={<Icon fontSize="small" color={title === "EURO" ? "success" : title === "GBP" ? "warning" : "primary"} />} />

                <Box>
                  <Paragraph fontWeight={500}>{numberFormat(value)}</Paragraph>
                </Box>
              </FlexBetween>)}
          </Stack>
        </Grid>
      </Grid>
    </Card>;
};
export default CurrentCurrencyTwo;