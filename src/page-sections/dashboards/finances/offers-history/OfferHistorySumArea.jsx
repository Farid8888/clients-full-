// CUSTOM COMPONENTS
import { Box } from "@mui/material";
import { Paragraph } from "components/typography";
import { FlexBox } from "components/flexbox";
// CUSTOM HOOOKS
import { useTranslation } from "react-i18next";

// ===================================================================

// ===================================================================

const OfferHistorySumArea = ({ filteredOffers, offerType }) => {
    const {
        t
    } = useTranslation();

    const sums = filteredOffers.reduce(function (sumObj, offer) {
        let parsedAmountSend = parseFloat(offer.amountSend);
        let parsedAmountTake = parseFloat(offer.amountTake);

        let amountSend = isNaN(parsedAmountSend) ? 0 : parsedAmountSend;
        let amountTake = isNaN(parsedAmountTake) ? 0 : parsedAmountTake;

        return {
            sendSum: sumObj.sendSum + amountSend,
            takeSum: sumObj.takeSum + amountTake,
        };
    }, { sendSum: 0, takeSum: 0 });

    return <Box>
        <FlexBox alignItems="center">
            <Paragraph fontSize={16}>{t("Total RUB: ")}{offerType === '0' ? sums.takeSum : sums.sendSum}</Paragraph>
        </FlexBox>
        <FlexBox alignItems="center">
            <Paragraph fontSize={16}>{t("Total USDT: ")}{offerType === '0' ? sums.sendSum : sums.takeSum}</Paragraph>
        </FlexBox>
    </Box>;
};
export default OfferHistorySumArea;