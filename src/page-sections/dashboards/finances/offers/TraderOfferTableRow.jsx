import { useState } from "react";
import { Chip, Box, Checkbox, TableCell, TableRow, TextField, Button } from "@mui/material";
import { Check, Edit } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { Bank } from "components/exgobit";
import { TableMoreMenuItem } from "components/table";
import BuyOfferModal from "./BuyOfferModal";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
import useOffers from "hooks/useOffers";
import { numberFormat } from "utils/numberFormat";

// ==============================================================

// ==============================================================

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const TraderOfferTableRow = props => {
    const {
        offer,
        isSelected,
        handleSelectRow
    } = props;
    const [openMenuEl, setOpenMenuEl] = useState(null);
    const handleOpenMenu = event => {
        setOpenMenuEl(event.currentTarget);
    };
    const handleCloseOpenMenu = () => setOpenMenuEl(null);

    const {
        t
    } = useTranslation();
    const {
        cancelOffer,
        cancelGroupOffer,
        updateOfferAmount,
        completeOffer
    } = useOffers();

    const [onEditTake, setOnEditTake] = useState(false);

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

            setOnEditTake(false);
        }
    });

    const offerStatus = {
        CREATED: 0,
        WAIT_ACCEPT: 1,
        ACCEPTED: 2,
        COMPLETE: 3,
        WAITING_VALIDATION: 5,
        COMPLETE_CLIENT: 7,
        VERIFICATION: 8,
        VERIFICATION_BAN: 9,
        BAN: 11,
        CANCEL_FRAUD: 12,
        CLIENT_VERIFICATION_AMOUNT: 13
    }
    
    const nowStatus = getEnumKeyByEnumValue(offerStatus, offer.status);

    const amountSend = offer.type === 0 ? offer.amountToken + ` ${offer.tokenCode}` : offer.amountFiat + ` ${offer.fiatInfos.fiatCode}`;
    const amountTake = offer.type === 0 ? offer.amountFiat + ` ${offer.fiatInfos.fiatCode}` : offer.amountToken + ` ${offer.tokenCode}`;

    const canEdit = offer.type === 1 && (offer.status === 2 || offer.status === 7);

    const canComplete = offerStatus === 2 && (offerStatus === 7 || offerStatus === 8);

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

        <TableCell padding="normal">
            {!onEditTake ? numberFormat(amountSend) : <TextField
                fullWidth
                name="amountFiat"
                value={values.amountFiat}
                onChange={handleChange}
                disabled={!onEditTake}
                helperText={touched.amountFiat && errors.amountFiat}
                error={Boolean(touched.amountFiat && errors.amountFiat)} />}
            {canEdit && !onEditTake && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                handleOnEditTake();
            }} />}
            {canEdit && onEditTake && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                handleSave();
            }} />}
        </TableCell>

        <TableCell padding="normal">{numberFormat(offer.fiatInfos.fiatRate)}</TableCell>

        <TableCell padding="normal">{format(new Date(offer.createdAt * 1000), "dd.MM.yyyy, hh:mm:ss")}</TableCell>

        <TableCell padding="normal">
            {offer.type === 1 && canComplete && <Button sx={{ minWidth: 100 }} onClick={() => { completeOffer(offer.id); }}>{t("Complete")}</Button>}
            {offer.status !== 8 && offer.status !== 9  && <BuyOfferModal offer={offer} nowStatus={nowStatus}></BuyOfferModal>}
            {offer.type === 0 && offer.status !== 3 && offer.status !== 9 && <Button sx={{ minWidth: 100, marginBottom: 1 }} onClick={() => { handleCloseOpenMenu(); cancelOffer(offer.id); }}>{t("Cancel")}</Button>}
            {offer.type === 0 && offer.status !== 3 && offer.status !== 9 && offer.groupOfferCountFiltered > 1 && <Button sx={{ minWidth: 100 }} onClick={() => { cancelGroupOffer(offer.humanId) }}>{t("Cancel") + ' ' + offer.groupOfferCountFiltered + '\\' + offer.groupOfferCount + `(${offer.groupAmountFiatFiltered} RUB)`}</Button>}
        </TableCell>
    </TableRow >;
};
export default TraderOfferTableRow;