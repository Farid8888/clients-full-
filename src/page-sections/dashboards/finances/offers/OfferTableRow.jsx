import { useState } from "react";
import { Button, Chip, Box, Checkbox, TableCell, TableRow, TextField } from "@mui/material";
import { Check, Edit } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { Bank } from "components/exgobit";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { TableMoreMenuItem } from "components/table";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM DEFINED HOOK
import useOffers from "hooks/useOffers";
import { numberFormat } from "utils/numberFormat";

// ==============================================================

// ==============================================================

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const OfferTableRow = props => {
    const {
        offer,
        isSelected,
        handleSelectRow,
        isTrader,
        withMessage
    } = props;

    const {
        t
    } = useTranslation();
    const {
        acceptClientAmountOffer,
        acceptOffer,
        acceptGroupOffer,
        cancelOffer,
        cancelGroupOffer,
        updateOfferAmount
    } = useOffers();

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
    };

    const [onEditSend, setOnEditSend] = useState(false);
    const [onEditTake, setOnEditTake] = useState(false);

    const handleOnEditSend = () => setOnEditSend(!onEditSend);
    const handleOnEditTake = () => setOnEditTake(!onEditTake);
    const handleSave = () => {
        handleSubmit();
    }

    const initialValues = {
        offerId: offer.id,
        amountFiat: offer.amountFiat,
    };

    const validationSchema = Yup.object({
        amountFiat: Yup.number(),
    });

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            updateOfferAmount(values.offerId, values.amountFiat);

            setOnEditSend(false);
            setOnEditTake(false);
        }
    });

    const nowStatus = getEnumKeyByEnumValue(offerStatus, offer.status);

    const amountSend = offer.type === 0 ? offer.amountToken + ` ${offer.tokenCode}` : offer.amountFiat + ` ${offer.fiatInfos.fiatCode}`;
    const amountTake = offer.type === 0 ? offer.amountFiat + ` ${offer.fiatInfos.fiatCode}` : offer.amountToken + ` ${offer.tokenCode}`;

    // услови€ дл€ редактировани€ сделок покупки
    //var canActionBuy = offer.type === 0 && offer.status === 1;
    // услови€ дл€ редактировани€ сделок продажи
    const canActionSell = offer.type === 1 && offer.status === 1;
    const canEdit = canActionSell && !isTrader;

    //услвои€ прин€ти€ сделки трейдером
    const canAcceptOffer = offer.status === 0 || offer.status === 1;

    const endStatuses = [3, 4, 7, 8, 9, 10, 11, 12, 13];
    // услови€ отмены сделки
    const canActionCancel = (offer.type === 0 || canActionSell) && !endStatuses.includes(offer.status) && offer.groupOfferCount === offer.groupOfferCountFiltered;

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
        
        <TableCell padding="normal">
            {!onEditSend ? numberFormat(amountTake) : <TextField
                fullWidth
                name="amountFiat"
                value={values.amountFiat}
                onChange={handleChange}
                disabled={!onEditSend}
                helperText={touched.amountFiat && errors.amountFiat}
                error={Boolean(touched.amountFiat && errors.amountFiat)} />}
            {offer.type === 0 && canEdit && !onEditSend && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                handleOnEditSend();
            }} />}
            {offer.type === 0 && canEdit && onEditSend && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                handleSave();
            }} />}
        </TableCell>

        <TableCell padding="normal">
            {!onEditTake ? numberFormat(amountSend) : <TextField
                fullWidth
                name="amountFiat"
                value={values.amountFiat}
                onChange={handleChange}
                disabled={!onEditTake}
                helperText={touched.amountFiat && errors.amountFiat}
                error={Boolean(touched.amountFiat && errors.amountFiat)} />}
            {offer.type === 1 && canEdit && !onEditTake && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                handleOnEditTake();
            }} />}
            {offer.type === 1 && canEdit && onEditTake && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                handleSave();
            }} />}
        </TableCell>

        <TableCell padding="normal">{numberFormat(offer.fiatInfos.fiatRate)}</TableCell>

        <TableCell padding="normal">{format(new Date(offer.createdAt * 1000), "dd.MM.yyyy, hh:mm:ss")}</TableCell>
        
        {withMessage && offer.type === 0 && <TableCell padding="normal">{offer.message}</TableCell>}
       
        <TableCell padding="normal">
            {/* TRADER ACTIONS*/}
            {isTrader && canAcceptOffer && <Button sx={{ minWidth: 100, marginBottom: 1 }} onClick={() => { acceptOffer(offer.id); }}>{t("Accept")}</Button>}
            {isTrader && offer.groupOfferCountFiltered > 1 && <Button sx={{ minWidth: 100 }} onClick={() => { acceptGroupOffer(offer.humanId); }}>{t("Accept") + ' ' + offer.groupOfferCountFiltered + '\\' + offer.groupOfferCount + `(${offer.groupAmountFiatFiltered} RUB)`}</Button>}
            {/* CLIENT ACTIONS*/}
            {!isTrader && offer.status === 13 && <Button sx={{ minWidth: 100, marginBottom: 1 }} onClick={() => { acceptClientAmountOffer(offer.id, true); }}>{t("Accept")}</Button>}
            {!isTrader && offer.status === 13 && <Button sx={{ minWidth: 100 }} onClick={() => { acceptClientAmountOffer(offer.id, false); }}>{t("Reject")}</Button>}
            {!isTrader && canActionCancel && <Button sx={{ minWidth: 100, marginBottom: 1 }} onClick={() => { offer.groupOfferCountFiltered > 1 ? cancelGroupOffer(offer.humanId) : cancelOffer(offer.id); }}>{offer.groupOfferCountFiltered > 1 ? t("Cancel") + ' ' + offer.groupOfferCountFiltered + '\\' + offer.groupOfferCount + `(${offer.groupAmountFiatFiltered} RUB)` : t("Cancel")}</Button>}
        </TableCell>
    </TableRow >;
};
export default OfferTableRow;