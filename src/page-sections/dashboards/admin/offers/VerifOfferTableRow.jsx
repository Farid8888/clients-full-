import { TextField, Chip, Box, Checkbox, TableCell, TableRow, MenuItem } from "@mui/material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { Bank } from "components/exgobit";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import * as Yup from "yup";
// CUSTOM DEFINED HOOK
import VerifInfoModal from "./VerifInfoModal";

// ==============================================================

// ==============================================================

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const VerifOfferTableRow = props => {
    const {
        offer,
        isSelected,
        handleSelectRow
    } = props;

    const {
        t
    } = useTranslation();

    const offerStatus = {
        VERIFICATION: 8,
        VERIFICATION_BAN: 9,
    }

    var nowStatus = getEnumKeyByEnumValue(offerStatus, offer.status);

    var amountTake = offer.type === 0 ? offer.amountFiat + ` ${offer.fiatInfos.fiatCode}` : offer.amountToken + ` ${offer.tokenCode}`;

    return <TableRow hover>
        <TableCell padding="checkbox">
            <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, offer.id)} />
        </TableCell>

        <TableCell padding="normal">
            <FlexBox alignItems="center">
                <Box>
                    <Paragraph fontSize={10}>{offer.id}</Paragraph>
                    <Paragraph fontSize={13}>#{offer.humanId}</Paragraph>
                </Box>
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

        <TableCell padding="normal">{offer.clientId && offer.clientName}</TableCell>

        <TableCell padding="normal">{offer.traderId && offer.traderName}</TableCell>

        <TableCell padding="normal">{format(new Date(offer.createdAt * 1000), "dd.MM.yyyy, hh:mm:ss")}</TableCell>
        <TableCell padding="normal"><VerifInfoModal offer={offer} nowStatus={nowStatus}></VerifInfoModal></TableCell>

    </TableRow >;
};
export default VerifOfferTableRow;