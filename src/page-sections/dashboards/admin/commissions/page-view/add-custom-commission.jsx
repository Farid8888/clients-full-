import { useState, useEffect } from "react";
import { Box, Button, Card, Grid, Alert, TextField, MenuItem } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
// CUSTOM COMPONENTS
import { H6 } from "components/typography";
// CUSTOM ICON COMPONENT
import ErrorIcon from "icons/ErrorIcon";
// CUSTOM DEFINED HOOK
import useCommissions from "hooks/useCommissions";
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";

const AddPersonalCommissionPageView = () => {
    const [providerCodes, setProviderCodes] = useState({});
    const [firstFetch, setFirstFetch] = useState(true);
    const [errorCreate, setErrorCreate] = useState(null);
    const {
        t
    } = useTranslation();

    const navigate = useNavigate();

    const {
        customCommissionsData,
        resetCustomCommissionData,
        addCustomCommission,
        commissionsProviders,
        updateCommissionsProviders
    } = useCommissions();
    
    const initialValues = {
        percentClient: 0,
        percentOur: 0,
        offerType: 0,
        providerCode: "",
        tokenCode: "",
    };

    const validationSchema = Yup.object().shape({
        percentClient: Yup.number().required("Percent Client is Required!"),
        percentOur: Yup.number().required("Percent Our is Required!"),
        offerType: Yup.number().required("Offer Type is Required!"),
        providerCode: Yup.string().required("Provider is Required!"),
        tokenCode: Yup.string().required("Token is Required!"),
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
        onSubmit: () => {
            addCustomCommission(values);
        }
    });

    useEffect(() => {
        if (customCommissionsData && customCommissionsData.success) {
            resetCustomCommissionData();
            setErrorCreate(null);
            navigate(`/dashboard/admin/commissions`);
        } else if (customCommissionsData && !customCommissionsData.success) {
            setErrorCreate("Error! Maybe already exists!");
        }

        if (firstFetch) {
            updateCommissionsProviders();
            setFirstFetch(false);
        }
        
        setProviderCodes(commissionsProviders);
    }, [customCommissionsData, navigate, firstFetch, values.userType, updateCommissionsProviders, commissionsProviders, resetCustomCommissionData]);

    return <Box pt={2} pb={4}>
        {/*ERROR FROM SERVER*/}
        {errorCreate && <Alert severity="error" variant="outlined" icon={<ErrorIcon />} sx={{ mb: 1.5 }}>
            <H6 fontSize={16}>{t(errorCreate)}</H6>
        </Alert>}
        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <Card sx={{
                    padding: 3
                }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    key={"tokenCode"}
                                    fullWidth
                                    name={"tokenCode"}
                                    select
                                    label="Token"
                                    value={values.tokenCode}
                                    onChange={handleChange}
                                    helperText={touched.tokenCode && errors.tokenCode}
                                    error={Boolean(touched.tokenCode && errors.tokenCode)}>
                                    {!Object.entries(providerCodes).length && <MenuItem key={'tcode'} value="">
                                        {"None"}
                                    </MenuItem>}
                                    {providerCodes && Object.entries(providerCodes).length !== 0 && Object.keys(providerCodes).map((key) => 
                                        <MenuItem key={'tcode ' + key} value={key}>
                                            {key}
                                        </MenuItem>
                                    )}
                                </TextField>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    key={"providerCode"}
                                    fullWidth
                                    name={"providerCode"}
                                    select
                                    label="Provider"
                                    value={values.providerCode}
                                    onChange={handleChange}
                                    helperText={touched.providerCode && errors.providerCode}
                                    error={Boolean(touched.providerCode && errors.providerCode)}>
                                    {values.token === "" && <MenuItem key={'pcode'} value="">
                                        {"None"}
                                    </MenuItem>}
                                    {providerCodes && Object.entries(providerCodes).length !== 0 && values.tokenCode !== "" && providerCodes[values.tokenCode].banks.map((val, key) => 
                                        <MenuItem key={'pcode ' + key} value={val.code}>
                                            {val.name}
                                        </MenuItem>
                                    )}
                                </TextField>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="offerType"
                                    select
                                    label="Offer type"
                                    value={values.offerType}
                                    onChange={handleChange}
                                    helperText={touched.offerType && errors.offerType}
                                    error={Boolean(touched.offerType && errors.offerType)}>
                                    <MenuItem key={0} value={0}>
                                        {t("Buy")}
                                    </MenuItem>
                                    <MenuItem key={1} value={1}>
                                        {t("Sell")}
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="percentClient"
                                    label="Percent Client"
                                    value={values.percentClient}
                                    onChange={handleChange}
                                    helperText={touched.percentClient && errors.percentClient}
                                    error={Boolean(touched.percentClient && errors.percentClient)} />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="percentOur"
                                    label="Percent Our"
                                    value={values.percentOur}
                                    onChange={handleChange}
                                    helperText={touched.percentOur && errors.percentOur}
                                    error={Boolean(touched.percentOur && errors.percentOur)} />
                            </Grid>

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">
                                    Create Custom Commission
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            </Grid>
        </Grid>
    </Box>;
};
export default AddPersonalCommissionPageView;