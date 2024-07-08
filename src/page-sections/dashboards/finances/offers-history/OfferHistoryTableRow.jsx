import { Chip, Box, Checkbox, TableCell, TableRow, Button } from "@mui/material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { Bank } from "components/exgobit";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { numberFormat } from "utils/numberFormat";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";

// ==============================================================

// ==============================================================

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const OfferHistoryTableRow = props => {
    const {
        offer,
        isSelected,
        handleSelectRow,
        withMessage,
        openModal
    } = props;

    const {
        t
    } = useTranslation();

    const {
        roleName
    } = useAuth();

    const offerStatus = {
        CREATED: 0,
        WAIT_ACCEPT: 1,
        ACCEPTED: 2,
        COMPLETE: 3,
        REJECTED: 4,
        WAITING_VALIDATION: 5,
        DEAD_VALIDATION: 6,
        COMPLETE_CLIENT: 7,
        VERIFICATION: 8,
        VERIFICATION_BAN: 9,
        CANCEL: 10,
        BAN: 11,
        CANCEL_FRAUD: 12,
        CLIENT_VERIFICATION_AMOUNT: 13,
        CANCEL_VERIFICATION: 14,
    };

    //Можно отправить верификацию только клиенту со статусами сделок покупки rejected и cancel
    const isCanVerif = (roleName === "Client" || roleName === "Manager") && offer.type === 0 && (offer.status === 4 || offer.status === 10 || offer.status === 14);

    const nowStatus = getEnumKeyByEnumValue(offerStatus, offer.status);

    const amountSend = offer.type === 0 ? offer.amountToken + ` ${offer.tokenCode}` : offer.amountFiat + ` ${offer.fiatInfos.fiatCode}`;
    const amountTake = offer.type === 0 ? offer.amountFiat + ` ${offer.fiatInfos.fiatCode}` : offer.amountToken + ` ${offer.tokenCode}`;

    const verificateOffer = () => {
        localStorage.setItem("offerVerifId", offer.id);
        openModal();
    };

    return <TableRow hover>
        <TableCell padding="checkbox">
            <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, offer.id)} />
        </TableCell>

        <TableCell padding="normal">
            <Box>
                <Paragraph fontSize={10}>{offer.id}</Paragraph>
                <Paragraph fontSize={13}>#{offer.humanId}</Paragraph>
            </Box>
        </TableCell>

        <TableCell padding="normal"><Chip label={t(nowStatus)} /></TableCell>

        <TableCell padding="normal">
            {offer.fiatInfos.cardNumber}
            <Bank bankCode={offer.fiatInfos.providerCode} fiatCode={offer.fiatInfos.fiatCode} />
        </TableCell>

        <TableCell padding="normal">{numberFormat(amountTake)}</TableCell>

        <TableCell padding="normal">{numberFormat(amountSend)}</TableCell>

        <TableCell padding="normal">{numberFormat(offer.fiatInfos.fiatRate)}</TableCell>

        <TableCell padding="normal">{format(new Date(offer.createdAt * 1000), "dd.MM.yyyy, hh:mm:ss")}</TableCell>

        {withMessage && offer.type === 0 && <TableCell padding="normal">{offer.message}</TableCell>}

        {/*ТОЛЬКО 1 ДЕЙСТВИЕ У КЛИЕНТОВ ВЕРИФИКАЦИЯ */}
        {isCanVerif && <TableCell padding="normal">
            {/* CLIENT VERIFICATION*/}
            <Button sx={{ minWidth: 100, marginBottom: 1 }} onClick={() => { verificateOffer(); }}>{t("Verif")}</Button>
        </TableCell>}
    </TableRow >;
};
export default OfferHistoryTableRow;