import { useState, useEffect } from "react";
import { Box, Button, Card, Grid, TextField, MenuItem } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import useAuth from "hooks/useAuth";
import useOffers from "hooks/useOffers";
import useNavigate from "hooks/useNavigate";

const AddNewOfferPageView = () => {
    const [isDisplay, setIsDisplay] = useState(false);
    const navigate = useNavigate();
    const {
        user
    } = useAuth();

    const {
        t
    } = useTranslation();

    const {
        offerData,
        createOffer
    } = useOffers();

    const initialValues = {
        amount: 0,
        type: 0,
        tokenCode: "",
        fiatCode: "RUB",
        cardNumber: "",
        cardHolder: "",
        comment: ""
    };
    const validationSchema = Yup.object().shape({
        amount: Yup.number().min(1).required("Amount is Required!"),
        type: Yup.number().required("Offer Type is Required!"),
        tokenCode: Yup.string().required("Token Code is Required!"),
        fiatCode: isDisplay ? Yup.string().required("Fiat Code is Required!") : "",
        cardNumber: isDisplay ? Yup.string().min(16).max(16).required("Card Number is Required!") : "",
        cardHolder: isDisplay ? Yup.string().required("Card Holder is Required!") : "",
        comment: Yup.string()
    });

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        touched
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            let providerCode = values.providerCode;

            if (values.providerCode === "anyBank") {
                providerCode = "";
            }

            if (values.type === 1) {
                providerCode = "";
            }

            try {
                createOffer(values.amount, values.tokenCode, values.type, values.fiatCode, values.cardNumber, values.cardHolder, providerCode);
            } catch (error) {
                console.log(error);
            }
        }
    });

    const handleSelectOnChange = event => {
        setIsDisplay(event.target.value === 1);
        handleChange(event);
    };

    const offerTypes = [
        {
            value: 0,
            label: t("offer typeBuy"),
        },
        {
            value: 1,
            label: t("offer typeSell"),
        },
    ];

    const tokenCodes = [];

    const providerCodes = [{
        value: "anyBank",
        label: t("Any Bank"),
    }];

    user && user.fiatPermissions.map(({
        canBuy,
        canSell,
        code,
        name
    }) => {
        if ((values.type === 1 && canBuy) || (values.type === 0 && canSell)) {
            providerCodes.push({
                value: code,
                label: name,
            })
        }

        return 0;
    });


    const fiatCodes = [
        {
            value: "RUB",
            label: "RUB",
        }
    ];

    user && user.tokenPermissions.map(({
        canBuy,
        canSell,
        code
    }) => {
        if ((values.type === 0 && canBuy) || (values.type === 1 && canSell)) {
            tokenCodes.push({
                value: code,
                label: code,
            })
        }

        return 0;
    });

    useEffect(() => {
        if (offerData && offerData.success) {
            navigate("/dashboard");
        }
    }, [navigate, offerData]);

    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Card sx={{
                    padding: 3
                }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12}>
                                <TextField fullWidth name="amount" label={t("offer amount")} value={values.amount} onChange={handleChange} helperText={touched.amount && errors.amount} error={Boolean(touched.amount && errors.amount)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="type"
                                    label={t("offer type")}
                                    defaultValue={0}
                                    value={values.type}
                                    onChange={handleSelectOnChange}
                                    helperText={touched.type && errors.type}
                                    error={Boolean(touched.type && errors.type)}>
                                    {offerTypes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="tokenCode"
                                    label={t("offer tokenCode")}
                                    value={values.tokenCode}
                                    onChange={handleChange}
                                    helperText={touched.tokenCode && errors.tokenCode}
                                    error={Boolean(touched.tokenCode && errors.tokenCode)}>
                                    {tokenCodes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {!isDisplay && <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="providerCode"
                                    label={t("offer providerCode")}
                                    value={values.providerCode}
                                    defaultValue="anyBank"
                                    onChange={handleChange}
                                    helperText={touched.providerCode && errors.providerCode}
                                    error={Boolean(touched.providerCode && errors.providerCode)}>
                                    {providerCodes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>}

                            {isDisplay && <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="fiatCode"
                                    label={t("offer fiatCode")}
                                    defaultValue="RUB"
                                    value={values.fiatCode}
                                    onChange={handleChange}
                                    helperText={touched.fiatCode && errors.fiatCode}
                                    error={Boolean(touched.fiatCode && errors.fiatCode)}>
                                    {fiatCodes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>}

                            {isDisplay && <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="cardNumber"
                                    label={t("offer cardNumber")}
                                    value={values.cardNumber}
                                    onChange={handleChange}
                                    helperText={touched.cardNumber && errors.cardNumber}
                                    error={Boolean(touched.cardNumber && errors.cardNumber)} />
                            </Grid>}

                            {isDisplay && <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="cardHolder"
                                    label={t("offer cardHolder")}
                                    value={values.cardHolder}
                                    onChange={handleChange}
                                    helperText={touched.cardHolder && errors.cardHolder}
                                    error={Boolean(touched.cardHolder && errors.cardHolder)} />
                            </Grid>}

                            <Grid item xs={12}>
                                <TextField multiline fullWidth rows={10} name="comment" label={t("offer comment")} value={values.comment} onChange={handleChange} helperText={touched.comment && errors.comment} error={Boolean(touched.comment && errors.comment)} sx={{
                                    "& .MuiOutlinedInput-root textarea": {
                                        padding: 0
                                    }
                                }} />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained">
                                    {t("Create order")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            </Grid>
        </Grid>
    </Box>;
};
export default AddNewOfferPageView;