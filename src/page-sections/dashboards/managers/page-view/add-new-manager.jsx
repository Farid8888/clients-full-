import { useState, useEffect } from "react";
import { Box, Button, Card, Grid, TextField, InputAdornment, IconButton, Alert } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import FlexBox from "components/flexbox/FlexBox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// CUSTOM ICON COMPONENTS
import ErrorIcon from "icons/ErrorIcon";
import NotificationAlert from "icons/NotificationAlert";
// CUSTOM COMPONENTS
import { H6 } from "components/typography";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
import useManagers from "hooks/useManagers";

const AddNewManagerPageView = () => {
    const navigate = useNavigate();
    const {
      t
    } = useTranslation();
    const {
      addManager,
      managerAddData
    } = useManagers();

    const [notifData, setNotifData] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const initialValues = {
        userName: "",
        email: "",
        phone: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("Name is Required!"),
        password: Yup.string().min(6).required("Password is Required!"),
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
            addManager(values);
        }
    });

    useEffect(() => {
        if (managerAddData) {
            if (managerAddData.success) {
              navigate("/dashboard/managers/list");
            }
            else {
              setNotifData({
                success: managerAddData.success,
                message: managerAddData.message
              });
            }
        }
    }, [managerAddData, navigate]);

    const ALPHA_NUMERIC_DASH_REGEX = /^[a-zA-Z0-9-]+$/;

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
                                <TextField
                                    fullWidth
                                    name="userName"
                                    label={t("Name")}
                                    value={values.userName}
                                    onChange={handleChange}
                                    onKeyDown={(event) => {
                                      if (!ALPHA_NUMERIC_DASH_REGEX.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                    helperText={touched.userName && errors.userName}
                                    error={Boolean(touched.userName && errors.userName)} />
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

                            <Grid item xs={12}>
                                <FlexBox flexWrap="wrap" gap={2}>
                                    <Button type="submit" variant="contained">
                                        {t("Create Manager")}
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
export default AddNewManagerPageView;