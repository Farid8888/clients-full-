import { useState, useEffect } from "react";
import { Box, Button, Card, Divider, Grid, Stack, styled, TextField, Alert } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
// CUSTOM COMPONENTS
import FlexBox from "components/flexbox/FlexBox";
import { H6, Paragraph, Small } from "components/typography";
// CUSTOM ICON COMPONENT
import ErrorIcon from "icons/ErrorIcon";
import NotificationAlert from "icons/NotificationAlert";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
import useAuth from "hooks/useAuth";

// STYLED COMPONENT
const Dot = styled(Box)(({
  theme
}) => ({
  width: 8,
  height: 8,
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main
}));

const Password = () => {
  const {
    t
  } = useTranslation();

  const {
    resetPasswordData,
    resetPassword,
    updateResetPasswordData
  } = useAuth();

  const [notifData, setNotifData] = useState(null);
  // FORMIK
  const initialValues = {
    newPassword: "",
    confirmNewPassword: ""
  };
  const validationSchema = Yup.object({
    newPassword: Yup.string().min(6).required("New Password is Required!"),
    confirmNewPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Password doesn't matched")
  });
  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    touched
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
        resetPassword(values.newPassword);
    }
  });

  useEffect(() => {
    if (resetPasswordData) {
        setNotifData(resetPasswordData);
        updateResetPasswordData();
    }
  }, [resetPasswordData, updateResetPasswordData]);

  return <Card>
      <H6 fontSize={14} p={3}>
        {t("Change Your Password")}
      </H6>

      <Divider />

      <Box p={3}>
        {/*ERROR FROM SERVER*/}
        {notifData && <Alert severity={notifData.success ? "success" : "error"} variant="outlined" icon={notifData.success ? <NotificationAlert /> : <ErrorIcon />} sx={{ mb: 1.5 }}>
          <H6 fontSize={16}>{t(notifData.message)}</H6>
        </Alert>}
        <Grid container spacing={5}>
          <Grid item sm={6} xs={12}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <TextField fullWidth type="password" name="newPassword" variant="outlined" label={t("New Password")} onBlur={handleBlur} onChange={handleChange} value={values.newPassword} helperText={touched.newPassword && errors.newPassword} error={Boolean(touched.newPassword && errors.newPassword)} />
                <TextField fullWidth type="password" variant="outlined" name="confirmNewPassword" label={t("Confirm Password")} onBlur={handleBlur} onChange={handleChange} value={values.confirmNewPassword} helperText={touched.confirmNewPassword && errors.confirmNewPassword} error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)} />
              </Stack>

              <Stack direction="row" spacing={2} mt={4}>
                <Button type="submit" variant="contained">
                  {t("Save Changes")}
                </Button>

                <Button variant="outlined">{t("Cancel")}</Button>
              </Stack>
            </form>
          </Grid>

          <Grid item xs={12}>
            <Paragraph fontWeight={500}>{t("Password requirements:")}</Paragraph>
            <Small color="grey.500">{t("Ensure that these requirements are met:")}</Small>

            <Stack spacing={1} mt={2}>
              {REQUIREMENTS.map(item => <FlexBox alignItems="center" gap={1} key={item}>
                  <Dot />
                  <Small>{t(item)}</Small>
                </FlexBox>)}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Card>;
};
const REQUIREMENTS = [
    "Minimum 6 characters long - the more, the better",
    "At least one lowercase character",
    "At least one uppercase character",
    "At least one number, symbol, or whitespace character"
];
export default Password;