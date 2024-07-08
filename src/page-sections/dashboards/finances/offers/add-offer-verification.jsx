/* eslint-disable no-unused-vars */
import { useCallback, useState, useEffect } from "react";
import { Box, Button, Card, Grid, TextField, Chip } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM COMPONENTS
import { H6 } from "components/typography";
import { DropZone } from "components/dropzone";
import FlexBox from "components/flexbox/FlexBox";
import { IconWrapper } from "components/icon-wrapper";
// CUSTOM ICON COMPONENT
import Invoice from "icons/sidebar/Invoice";
// CUSTOM DEFINED HOOK
import useOfferVerification from "hooks/useOfferVerification";
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";

const AddOfferVerificationPageView = () => {
    const [file, setFile] = useState(null);
    const [offerId, setOfferId] = useState("");
    const {
        sendVerificationOffer,
        offerVerificationData
    } = useOfferVerification();

    const {
        t
    } = useTranslation();

    const navigate = useNavigate();

    const handleDropFile = useCallback(acceptedFiles => {
        const file = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })).find(f => f !== null && f !== 'undefined');
        setFile(file);
    }, []);

    const handleRemoveFile = useCallback(() => {
        setFile(null);
    }, []);

    const handleCancel = useCallback(() => {
        setFile(null);
        localStorage.setItem("offerVerifId", null);
        navigate("/dashboard/");
    }, [navigate]);
    
    const validationSchema = Yup.object({
        id: Yup.string().required("ID Offer is Required!"),
        amount: Yup.number(),
        cardNumber: Yup.number()
    });
    const initialValues = {
        id: offerId,
        amountFiat: '',
        cardNumber: '',
    };

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('offerId', values.id);
            formData.append('amountFiat', values.amountFiat);
            formData.append('cardNumber', values.cardNumber);

            sendVerificationOffer(formData);
        }
    });
    
    useEffect(() => {
        let offerVerifId = localStorage.getItem("offerVerifId");

        if (offerVerifId !== null && offerVerifId !== 'null' && offerVerifId !== 'undefined') {
            setOfferId(offerVerifId);
        } else {
            navigate("/dashboard/");
        }

        if (offerVerificationData && offerVerificationData.success === true) {
            localStorage.setItem("offerVerifId", null);
            navigate("/dashboard/");
        }
    }, [navigate, offerId, offerVerificationData, setOfferId, values]);
    
    return <Box pt={2} pb={4}>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{
                        p: 3
                    }}>
                        <Grid container spacing={3}>
                            <Grid container xs={12}
                                alignItems="center"
                                justifyContent="center">
                                <FlexBox gap={0} alignItems="center">
                                    <IconWrapper sx={{ bgcolor: "transparent" }}>
                                        <Invoice sx={{
                                            color: "primary.main"
                                        }} />
                                    </IconWrapper>

                                    <H6 fontSize={16} sx={{ ml: -2 }}>{t("Send Offer Verification")}</H6>
                                </FlexBox>
                            </Grid>

                            <Grid item md={8} xs={12} style={{ display: "none" }}>
                                <H6 fontSize={16} mb={3}>
                                    {t("Main Parameters")}
                                </H6>

                                <Grid container spacing={2}>
                                    <Grid item sm={8} xs={12}>
                                        <TextField
                                            fullWidth
                                            disabled={true}
                                            name="id"
                                            label={t("ID Offer")}
                                            value={!offerId ? values.id : values.id = offerId}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            helperText={touched.id && errors.id}
                                            error={Boolean(touched.id && errors.id)} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid container md={12} xs={12}
                                alignItems="center"
                                justifyContent="center">
                                <H6 fontSize={16} mb={3}>
                                    {t("Additional Parameters")}
                                </H6>

                                <Grid container spacing={2} mb={3}
                                    alignItems="center"
                                    justifyContent="center">
                                    <Grid item sm={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            type='number'
                                            name="amountFiat"
                                            label={t("Amount Transaction")}
                                            value={values.amountFiat}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            helperText={touched.amountFiat && errors.amountFiat}
                                            error={Boolean(touched.amountFiat && errors.amountFiat)} />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2}
                                    alignItems="center"
                                    justifyContent="center">
                                    <Grid item sm={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            type='number'
                                            name="cardNumber"
                                            label={t("Card Number")}
                                            value={values.cardNumber}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            helperText={touched.cardNumber && errors.cardNumber}
                                            error={Boolean(touched.cardNumber && errors.cardNumber)} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                
                <Grid item xs={12}>
                    <Card>
                        {file && <Grid item md={6} xs={12} sx={{
                            p: 3
                        }}>
                            <Chip label={file.name} onDelete={handleRemoveFile} />
                        </Grid>}
                        {!file && <DropZone onDrop={handleDropFile} />}
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <FlexBox flexWrap="wrap" gap={2}>
                        <Button type="submit" variant="contained">
                            {t("Send Offer Verification")}
                        </Button>

                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                            {t("Cancel")}
                        </Button>
                    </FlexBox>
                </Grid>
            </Grid>
        </form>
    </Box>;
};
export default AddOfferVerificationPageView;