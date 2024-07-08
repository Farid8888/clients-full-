import { useState, useEffect } from "react";
import { Box, Card, Grid, Button, Stack, TextField, Alert } from "@mui/material";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "components/typography";
import { FlexBox } from "components/flexbox";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM ICON COMPONENTS
import Key from "icons/Key";
import DevicesApple from "icons/DevicesApple";
import ErrorIcon from "icons/ErrorIcon";
import NotificationAlert from "icons/NotificationAlert";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";

const AddTwoFactorApp = (props) => {
    const {
        handleClose,
        tfAppData,
        getTFAData,
        verifyAppData,
        verifyApp,
        handleResetVerifyAppData
    } = props;

    const [firstFetch, setFirstFetch] = useState(true);
    const [notifData, setNotifData] = useState(null);
    const [qrCode, setQrCode] = useState("");
    const [key, setKey] = useState("");

    const {
        t
    } = useTranslation();
    const validationSchema = Yup.object({
        code: Yup.string().min(1).max(6).required("Code is Required!"),
    });
    const initialValues = {
        code: "",
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
        onSubmit: (values) => {
            verifyApp(values.code);
        }
    });

    const resetNotif = () => {
        setNotifData(null);
        handleResetVerifyAppData();
    }

    useEffect(() => {
        if (firstFetch) {
            getTFAData();
            setFirstFetch(false);
        }

        if (tfAppData) {
            if (tfAppData.success) {
                setKey(tfAppData.message.key);
                setQrCode(tfAppData.message.qrCode);
            } else {
                setNotifData({
                    success: tfAppData.success,
                    message: tfAppData.message
                });
            }
        }

        if (verifyAppData) {
            if (verifyAppData.success) {
                handleClose();
            } else {
                setNotifData({
                    success: verifyAppData.success,
                    message: verifyAppData.message
                });
            }
        }
    }, [firstFetch, getTFAData, handleClose, tfAppData, verifyAppData]);

    return <Card>
        {/*ERROR FROM SERVER*/}
        {notifData && <Alert severity={notifData.success ? "success" : "error"} variant="outlined" icon={notifData.success ? <NotificationAlert /> : <ErrorIcon />} sx={{ mb: 1.5 }}>
            <H6 fontSize={16}>{t(notifData.message)}</H6>
        </Alert>}
        <Card sx={{
            padding: 2,
            display: "flex",
            boxShadow: "none",
            alignItems: "center",
            borderColor: "divider",
            justifyContent: "space-between"
        }}>
            <Grid container spacing={0}>
                <Grid item sm={6} xs={12}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <DevicesApple sx={{
                            color: "primary"
                        }} />
                        <H6 fontSize={19}>{t("Scan the QR code")}</H6>
                    </Stack>

                    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <Box component="img" src={qrCode} />
                    </Box>
                </Grid>
                <Grid item sm={6} xs={12} p={1}>
                    <form onSubmit={handleSubmit}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Key sx={{
                                    color: "primary"
                                }} />
                                <H6 fontSize={19}>{t("Or enter the code into your application")}</H6>
                            </Stack>

                            <Paragraph mt={1} mb={1}>
                                {t("Secret code: ")}{key}
                            </Paragraph>

                            <TextField
                                fullWidth
                                disabled={key===""}
                                name="code"
                                label={t("Code in app")}
                                onBlur={handleBlur}
                                value={values.code}
                                onChange={(e) => { if (notifData) { resetNotif(); } handleChange(e); }}
                                helperText={touched.code && errors.code}
                                error={Boolean(touched.code && errors.code)}>
                            </TextField>

                            <Grid item xs={12} mt={1}>
                                <FlexBox alignItems="center" gap={2}>
                                    <Button disabled={key === ""} type="submit">{t("Add")}</Button>

                                    <Button color="secondary" variant="outlined" onClick={handleClose}>
                                        {t("Cancel")}
                                    </Button>
                                </FlexBox>
                            </Grid>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </Card>
    </Card>;
};
export default AddTwoFactorApp;