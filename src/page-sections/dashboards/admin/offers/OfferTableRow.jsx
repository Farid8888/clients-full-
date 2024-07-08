import { useState } from "react";
import { TextField, Chip, Box, Checkbox, TableCell, TableRow, MenuItem } from "@mui/material";
import { Check, Edit } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { Bank } from "components/exgobit";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { TableMoreMenuItem } from "components/table";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM DEFINED HOOK
import useOffers from "hooks/useOffers";

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
        handleSelectRow
    } = props;

    const {
        t
    } = useTranslation();

    const {
        changeOfferStatus
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
        CANCEL: 10,
        CLIENT_VERIFICATION_AMOUNT: 11,
        CANCEL_VERIFICATION: 14
    }
    
    const [onEdit, setOnEdit] = useState(false);

    const handleOnEdit = () => setOnEdit(!onEdit);
    const handleSave = () => {
        handleSubmit();
    }

    const initialValues = {
        offerId: offer.id,
        newStatus: offer.status,
    };
    
    const validationSchema = Yup.object({
        newStatus: Yup.number(),
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
            changeOfferStatus(values);

            setOnEdit(!onEdit);
        }
    });

    const statusTypes = [
        {
            value: 0,
            label: t("CREATED")
        },
        {
            value: 1,
            label: t("WAIT_ACCEPT")
        },
        {
            value: 2,
            label: t("ACCEPTED")
        },
        {
            value: 3,
            label: t("COMPLETE")
        },
        {
            value: 4,
            label: t("REJECTED")
        },
        {
            value: 5,
            label: t("WAITING_VALIDATION")
        },
        {
            value: 6,
            label: t("DEAD_VALIDATION")
        },
        {
            value: 7,
            label: t("COMPLETE_CLIENT")
        },
        {
            value: 10,
            label: t("CANCEL")
        },
        {
            value: 11,
            label: t("BAN")
        },
        {
            value: 12,
            label: t("CANCEL_FRAUD")
        },
        {
            value: 13,
            label: t("CLIENT_VERIFICATION_AMOUNT")
        }
    ]

    var nowStatus = getEnumKeyByEnumValue(offerStatus, offer.status);

    var amountSend = offer.type === 0 ? offer.amountToken + ` ${offer.tokenCode}` : offer.amountFiat + ` ${offer.fiatInfos.fiatCode}`;
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
                {!onEdit ? <Chip label={t(nowStatus)} /> : <TextField
                    fullWidth
                    select
                    name="newStatus"
                    value={values.newStatus}
                    defaultValue={offer.status}
                    onChange={handleChange}
                    disabled={!onEdit}
                    helperText={touched.newStatus && errors.newStatus}
                    error={Boolean(touched.newStatus && errors.newStatus)}>
                    {statusTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>}
                {!onEdit && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                    handleOnEdit();
                }} />}
                {onEdit && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                    handleSave();
                }} />}
            </FlexBox>
        </TableCell>

        <TableCell padding="normal">
            {offer.fiatInfos.cardNumber}
            <Bank bankCode={offer.fiatInfos.providerCode} fiatCode={offer.fiatInfos.fiatCode} />
        </TableCell>

        <TableCell padding="normal">{amountTake}</TableCell>

        <TableCell padding="normal">{amountSend}</TableCell>

        <TableCell padding="normal">{offer.fiatInfos.fiatRate}</TableCell>

        <TableCell padding="normal">
            {offer.clientName && <Paragraph fontSize={16}>{offer.clientName}</Paragraph>}
            {offer.clientId && <Paragraph fontSize={13}>#{offer.clientId.substring(24, 36)}</Paragraph>}
        </TableCell>

        <TableCell padding="normal">
            {offer.traderName && <Paragraph fontSize={16}>{offer.traderName}</Paragraph>}
            {offer.traderId && <Paragraph fontSize={13}>#{offer.traderId.substring(24, 36)}</Paragraph>}
        </TableCell>

        <TableCell padding="normal">{format(new Date(offer.createdAt * 1000), "dd.MM.yyyy, hh:mm:ss")}</TableCell>
    </TableRow >;
};
export default OfferTableRow;