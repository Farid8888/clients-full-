import { useState, useEffect } from "react";
import { Box, Button, Container } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import OtpInput from "react-otp-input";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
// CUSTOM COMPONENTS
import { H1, Paragraph } from "components/typography";
import ChevronLeft from "icons/ChevronLeft";
// CUSTOM UTILS METHOD
import { isDark } from "utils/constants";
// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";

const VerifyTFAppView = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();

  const {
    isTfaEnabled,
    tfAppErrors,
    clearTfAppErrors,
    loginTFA,
    logout
  } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (otp.length !== 6) {
        alert("Invalid Code!");
        setLoading(false);
        return;
      }

      if (otp && isTfaEnabled) {
        await loginTFA(otp);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !isError) {
      handleSubmit();
    }

    if (otp.length < 6 && isError) {
      clearTfAppErrors();
      setIsError(false);
    }

    if (tfAppErrors) {
        //alert(tfAppErrors);
        setIsError(true);
    }

    if (!isTfaEnabled) {
      navigate("/login");
    }
  }, [tfAppErrors, isTfaEnabled, navigate, otp.length, isError, clearTfAppErrors]);

  return <Container>
      <Box textAlign="center" py={{
      sm: 6,
      xs: 4
    }}>
        <Box maxWidth={120} margin="auto" color="white">
          <img src="/static/pages/tfapp.svg" alt="email" width="100%" />
        </Box>

        <H1 mt={{
        sm: 4,
        xs: 2
      }} mb={2} fontSize={{
        sm: 52,
        xs: 36
      }}>
          {t("Check your app!")}
        </H1>

        <Paragraph mt={0.5} margin="auto" maxWidth={650} color="text.secondary" fontSize={{
        sm: 18,
        xs: 14
      }}>
          {t("The authentication code is specified in your application.")}<br/>
          {t("For example, Google Authenticator (IOS - Android) or Authy (IOS - Android).")}
        </Paragraph>
        
        <Box maxWidth={450} margin="auto" mt={6}>
          <OtpInput value={otp} numInputs={6} shouldAutoFocus={true} onChange={setOtp} placeholder="------" inputType="number" renderInput={props => <Box component="input" {...props} sx={{
          all: "unset",
          width: 70,
          height: 70,
          fontSize: 18,  
          flexBasis: 70,
          borderRadius: 4,
          fontWeight: 600,
          color: isError ? "rgb(239, 71, 112)" : "text.primary",
          backgroundColor: isError ? "rgb(254, 241, 244)" : (theme => isDark(theme) ? "grey.800" : "grey.100"),
          input: {
            textAlign: "center",
          },
          "::placeholder": {
            color: isError ? "rgb(239, 71, 112)" : "text.primary"
          }
        }} />} containerStyle={{
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "3rem"
        }} />

          <LoadingButton loading={loading} fullWidth onClick={handleSubmit}>
            {t("Verify")}
          </LoadingButton>
        </Box>

          <Button variant="text" disableRipple onClick={() => { logout(); navigate("/login"); }}>
          <ChevronLeft /> {t("Return to sign in")}
        </Button>
      </Box>
    </Container>;
};
export default VerifyTFAppView;