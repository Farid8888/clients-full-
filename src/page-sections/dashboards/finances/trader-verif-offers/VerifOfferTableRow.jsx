import { Box, Chip, Checkbox, TableCell, TableRow, Button } from "@mui/material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { Bank } from "components/exgobit";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import useOffers from "hooks/useOffers";
import { Link as RouterLink } from "components/link";

// ==============================================================

// ==============================================================

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}
const StyledLink = ({
    href,
    title
}) => <Box href={href} target="blank" component={RouterLink} sx={{
    color: "text.secondary",
    "&:hover": {
        color: "text.primary"
    }
}}>
        {title}
</Box>;

const VerifOfferTableRow = props => {
    const {
        offer,
        isSelected,
        handleSelectRow
    } = props;

    const {
        t
    } = useTranslation();
    const {
        completeVerification,
    } = useOffers();

    const offerStatus = {
        VERIFICATION: 8,
        VERIFICATION_BAN: 9,
    }
   
    const nowStatus = getEnumKeyByEnumValue(offerStatus, offer.status);

    const amountTake = offer.type === 0 ? offer.amountFiat + ` ${offer.fiatInfos.fiatCode}` : offer.amountToken + ` ${offer.tokenCode}`;

    const verificationOffer = (offerStatus) => {
        completeVerification({ offerStatus, offerId: offer.id });
    };

    return <TableRow hover>
        <TableCell padding="checkbox">
            <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, offer.id)} />
        </TableCell>

        <TableCell padding="normal">
            <FlexBox alignItems="center">
                <Paragraph fontSize={10}>{offer.id}</Paragraph>
                <Paragraph fontSize={13}>{offer.humanId}</Paragraph>
            </FlexBox>
        </TableCell>

        <TableCell padding="normal">
            <FlexBox alignItems="center">
                {<Chip label={t(nowStatus)} />}
            </FlexBox>
        </TableCell>

        <TableCell padding="normal">
            {offer.fiatInfos.cardNumber}
            <Bank bankCode={offer.fiatInfos.providerCode} fiatCode={offer.fiatInfos.fiatCode} />
        </TableCell>

        <TableCell padding="normal">{amountTake}</TableCell>
        <TableCell padding="normal">{offer.verificationUrl && <StyledLink title="Verification Info" href={offer.verificationUrl} />}</TableCell>

        <TableCell padding="normal">{format(new Date(offer.createdAt * 1000), "dd.MM.yyyy, hh:mm:ss")}</TableCell>
        <TableCell padding="normal"><Button onClick={() => { verificationOffer(3) }}>{t("Accept")}</Button></TableCell>
    </TableRow >;
};
export default VerifOfferTableRow;