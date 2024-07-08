import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Card, Grid, Autocomplete, TextField, MenuItem } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
// CUSTOM DEFINED HOOK
import useCommissions from "hooks/useCommissions";
import useClients from "hooks/useClients";
import useTraders from "hooks/useTraders";
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";

const AddPersonalCommissionPageView = () => {
    let roleInUrl = new URLSearchParams(useLocation().search).get("role");
    const role = roleInUrl ? Number(roleInUrl) : 0;
    const [userList, setUserList] = useState([]);
    const [providerCodes, setProviderCodes] = useState({});
    const [firstFetch, setFirstFetch] = useState(true);
    const {
        t
    } = useTranslation();

    const navigate = useNavigate();

    const {
        addPersonalCommissionData,
        addPersonalCommission,
        commissionsProviders,
        updateCommissionsProviders
    } = useCommissions();

    const {
        clientsList,
        updateClientsList
    } = useClients();

    const {
        tradersList,
        updateTradersList
    } = useTraders();
    
    const initialValues = {
        userId: "",
        userName: "",
        userType: role,
        percent: 0,
        offerType: 0,
        providerCode: "",
        tokenCode: "",
    };

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("User Name is Required!"),
        userType: Yup.number().required("Role is Required!"),
        percent: Yup.number().required("Percent is Required!"),
        offerType: Yup.number().required("Offer Type is Required!"),
        providerCode: Yup.string().required("Provider is Required!"),
        tokenCode: Yup.string().required("Token is Required!"),
    });

    const {
        values,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            let user = null;
            switch (values.userType) {
                case 0:
                    user = clientsList.find(t => t.userName === values.userName);
                    break;
                case 1:
                    user = tradersList.find(t => t.userName === values.userName);
                    break;
                default:
                    break;
            }

            if (user) {
                values.userId = user.id;
                addPersonalCommission(values);
            } else {
                alert("user error!");
            }
        }
    });

    useEffect(() => {
        if ((addPersonalCommissionData && addPersonalCommissionData.success)) {
            let roleName = values.userType === 0 ? "clients" : "traders";
            navigate(`/dashboard/admin/personal-commissions-${roleName}`);
        }

        if (firstFetch) {
            updateCommissionsProviders();
            updateClientsList();
            updateTradersList();
            setFirstFetch(false);
        }

        switch (values.userType) {
            case 0:
                setUserList(clientsList); 
                break;
            case 1:
                setUserList(tradersList);
                break;
            default:
                break;
        }
        
        setProviderCodes(commissionsProviders);
    }, [
        addPersonalCommissionData,
        navigate,
        firstFetch,
        updateClientsList,
        updateTradersList,
        values.userType,
        tradersList,
        clientsList,
        updateCommissionsProviders,
        commissionsProviders
    ]);

    const handleAutocompleteChange = (event, value) => {
        values.userName = value;
    };

    return <Box pt={2} pb={4}>
        <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
                <Card sx={{
                    padding: 3
                }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="userType"
                                    select
                                    label="Role"
                                    value={values.userType}
                                    onChange={handleChange}
                                    helperText={touched.userType && errors.userType}
                                    error={Boolean(touched.userType && errors.userType)}>
                                    <MenuItem key={0} value={0}>
                                        {"Client"}
                                    </MenuItem>
                                    <MenuItem key={1} value={1}>
                                        {"Trader"}
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <Autocomplete
                                    id="free-solo-userName"
                                    fullWidth
                                    freeSolo
                                    options={userList && userList.map((option) => option.userName)}
                                    sx={{ height: '40px' }}
                                    onChange={handleAutocompleteChange}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            name="userName"
                                            label="User Name"
                                            variant="outlined"
                                            value={values.userName}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            helperText={touched.userName && errors.userName}
                                            error={Boolean(touched.userName && errors.userName)} />
                                    )}
                                />
                            </Grid>

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
                                    name="percent"
                                    label="Percent"
                                    value={values.percent}
                                    onChange={handleChange}
                                    helperText={touched.percent && errors.percent}
                                    error={Boolean(touched.percent && errors.percent)} />
                            </Grid>

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">
                                    Create Personal Commission
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