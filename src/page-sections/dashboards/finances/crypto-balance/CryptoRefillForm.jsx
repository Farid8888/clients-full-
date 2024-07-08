import { useCallback, useState, useEffect } from "react";
import { Box, Button, MenuItem, Card, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import FlexBox from "components/flexbox/FlexBox";
import { H6 } from "components/typography";

// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
import useCrypto from 'hooks/useCrypto';


//TODO: может быть логика все же лучше будет если выводим не по селекту а только по нажатию кнопки пополнения
const CryptoRefillForm = (props) => {
    const {
        handleClose,
    } = props;

    const {
        cryptoDeposits,
        cryptoTypes,
        updateTypes,
        refillCryptoDeposit,
        cancelRefillCryptoDeposit,
        refillInfo,
        updateRefillInfo,
        getCryptoDeposits
    } = useCrypto();

    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [firstFetch, setFirstFetch] = useState(true);
    const [updateRefills, setUpdateRefills] = useState(true);

    const validationSchema = Yup.object({
        amount: Yup.number().min(0.1).required("Amount is Required!"),
    });
    const initialValues = {
        amount: refillInfo ? refillInfo.refillAmount : 0,
        cryptoType: (cryptoTypes.length > 0) ? (cryptoTypes[0].id) : "" ///selectedDeposit ? selectedDeposit.typeId : ""
    };

    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit
    } = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            setUpdateRefills(true);
            !refillInfo && refillCryptoDeposit(values.cryptoType, values.amount).then(() => {
                if (!selectedDeposit) {
                    getCryptoDeposits();
                }

                selectedDeposit && updateRefillInfo(selectedDeposit.id);
            });

            refillInfo && cancelRefillCryptoDeposit(selectedDeposit.id);
        }
    });

    const {
        t
    } = useTranslation();

    const selectOnChange = (event) => {
        var sd = cryptoDeposits.find(d => d.typeId === event.target.value);
        sd && setSelectedDeposit(sd);
        sd && updateRefillInfo(sd.id);
        handleChange(event);
    };

    useEffect(() => {
        if (firstFetch) {
            updateTypes();

            setFirstFetch(false);
        }

        if (values.cryptoType !== '' && !selectedDeposit && cryptoDeposits) {
            var sd = cryptoDeposits.find(d => d.typeId === values.cryptoType);
            sd && setSelectedDeposit(sd);
        } else if (!selectedDeposit && cryptoDeposits) {
            sd = cryptoDeposits.find(e => typeof e !== 'undefined');
            sd && setSelectedDeposit(sd);
        }

        if (updateRefills && selectedDeposit) {
            updateRefillInfo(selectedDeposit.id);

            setUpdateRefills(false);
        }

    }, [updateTypes, firstFetch, updateRefillInfo, values.cryptoType, selectedDeposit, cryptoDeposits, values, updateRefills, cryptoTypes]);

    return <Card sx={{ p: 3 }}>
    <form onSubmit={handleSubmit}>
        <Box>
            <Grid container spacing={3}>
                <Grid item sm={12} xs={12}>
                    <TextField
                        fullWidth
                        select
                        label={t("Crypto type")}
                        name="cryptoType"
                        value={values.cryptoType}
                        onChange={selectOnChange}
                        helperText={touched.cryptoType && errors.cryptoType}
                        error={Boolean(touched.cryptoType && errors.cryptoType)}>
                            {cryptoTypes && cryptoTypes.map(ct => <MenuItem value={ct.id} key={ct.id}>{ct.name}</MenuItem>)}
                    </TextField>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <TextField 
                        fullWidth
                        disabled={refillInfo ? true : false}
                        name="amount"
                        label={t("offer amount")}
                        value={values.amount}
                        onChange={handleChange}
                        helperText={touched.amount && errors.amount}
                        error={Boolean(touched.amount && errors.amount)} />
                </Grid>

                <Grid item sm={12}>
                    <FlexBox flexWrap="wrap" gap={2} sx={{ justifyContent: 'center' }}>
                        <Button type="submit" variant="contained">
                            {refillInfo ? t("Refill Cancel") : t("Refill balance")}
                        </Button>

                        <Button variant="outlined" color="secondary" onClick={() => handleClose()}>
                            {t("card Cancel")}
                        </Button>
                    </FlexBox>
                </Grid>
            </Grid>
        </Box>
    </form>

    {selectedDeposit && refillInfo && <Grid container spacing={3}>
    <Grid item sm={12}>
            <FlexBox flexWrap="wrap" gap={2} sx={{ mt: 2, justifyContent: 'center' }}>
                <H6 fontSize={36} sx={{ p: 1, textAlign: 'center', backgroundColor: '#6950E8', borderRadius: '15px' }}>{refillInfo.provider}</H6>
                <H6 fontSize={36} sx={{ p: 1, textAlign: 'center', backgroundColor: '#6950E8', borderRadius: '15px' }}>{refillInfo.address}</H6>
            </FlexBox>
        </Grid>
    </Grid>}
</Card>;
};
export default CryptoRefillForm;