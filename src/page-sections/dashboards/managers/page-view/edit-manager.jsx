import { useState, useEffect } from "react";
import { Box, Button, Card, Grid, TextField, InputAdornment, IconButton, styled, Switch, Alert } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import FlexBox from "components/flexbox/FlexBox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// CUSTOM ICON COMPONENTS
import ErrorIcon from "icons/ErrorIcon";
import NotificationAlert from "icons/NotificationAlert";
// CUSTOM COMPONENTS
import { Paragraph, H6 } from "components/typography";
import { FlexBetween  } from "components/flexbox";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
import useManagers from "hooks/useManagers";

// STYLED COMPONENTS
const SwitchWrapper = styled(FlexBetween)({
    width: "100%",
    marginTop: 10
});

const EditManagerPageView = () => {
    const navigate = useNavigate();
    const {
      t
    } = useTranslation();
    const {
      manager,
      editManager,
      managerEditData
    } = useManagers();

    const [notifData, setNotifData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const initialValues = {
        id: manager ? manager.id : "",
        userName: manager ? manager.userName : "",
        email: manager ? manager.email : "",
        phone: manager ? manager.phone : "",
        password: "",
        isBanned: manager ? manager.isBanned : "",
    };

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("Name is Required!"),
        password: Yup.string().min(6)
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
            editManager(values);
        }
    });

    useEffect(() => {
        if (!manager) {
            navigate("/dashboard/managers/list");
        }

        if (managerEditData) {
            setNotifData({
                success: managerEditData.success,
                message: managerEditData.message
            });
        }
    }, [manager, managerEditData, navigate]);

    return <Box pt={2} pb={4}>
        {/*ERROR FROM SERVER*/}
        {notifData && <Alert severity={notifData.success ? "success" : "error"} variant="outlined" icon={notifData.success ? <NotificationAlert /> : <ErrorIcon />} sx={{ mb: 1.5 }}>
            <H6 fontSize={16}>{t(notifData.message)}</H6>
        </Alert>}
        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <Card sx={{
                    padding: 3
                }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12}>
                                <TextField fullWidth name="userName" label={t("Name")} value={values.userName} onChange={handleChange} helperText={touched.userName && errors.userName} error={Boolean(touched.userName && errors.userName)} />
                            </Grid>

                            {/*<Grid item sm={6} xs={12}>*/}
                            {/*    <TextField fullWidth name="email" label={t("Email")} value={values.email} onChange={handleChange} helperText={touched.email && errors.email} error={Boolean(touched.email && errors.email)} />*/}
                            {/*</Grid>*/}

                            {/*<Grid item sm={6} xs={12}>*/}
                            {/*    <TextField fullWidth name="phone" label={t("Phone Number")} value={values.phone} onChange={handleChange} helperText={touched.phone && errors.phone} error={Boolean(touched.phone && errors.phone)} />*/}
                            {/*</Grid>*/}

                            <Grid item sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    label={t("Password")}
                                    value={values.password}
                                    onChange={handleChange}
                                    helperText={touched.password && errors.password}
                                    error={Boolean(touched.password && errors.password)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <SwitchWrapper>
                                    <Paragraph display="block" fontWeight={600}>
                                        Inactive
                                    </Paragraph>
                                    <Switch name="isBanned" checked={values.isBanned} onChange={handleChange} />
                                </SwitchWrapper>
                            </Grid>

                            <Grid item xs={12}>
                                <FlexBox flexWrap="wrap" gap={2}>
                                    <Button type="submit" variant="contained">
                                        {t("Save")}
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard/managers/list")}>
                                        {t("Cancel")}
                                    </Button>
                                </FlexBox>
                            </Grid>
                        </Grid>
                    </form>
                </Card>
            </Grid>
        </Grid>
    </Box>;
};
export default EditManagerPageView;