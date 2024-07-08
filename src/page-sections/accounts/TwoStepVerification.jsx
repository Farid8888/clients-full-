import { useState, useEffect } from "react";
import { IconButton, Card, Divider, Stack, Switch, Box, Modal, List, ListItem, Alert } from "@mui/material";
// CUSTOM COMPONENTS
import { H6, H5, Small } from "components/typography";
import DeleteIcon from "icons/DeleteIcon";
import AddTwoFactorApp from "./common/AddTwoFactorApp";
// CUSTOM ICON COMPONENT
import ErrorIcon from "icons/ErrorIcon";
import NotificationAlert from "icons/NotificationAlert";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
import useTFApp from "hooks/useTFApp";

const TwoStepVerification = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [enableTFA, setEnableTFA] = useState(false);
  const [tfAppEnabled, setTfAppEnabled] = useState(false);
  const [notifData, setNotifData] = useState(null);
  const {
    t
  } = useTranslation();

  const {
    status,
    getStatus,
    getTFAData,
    tfAppData,
    switchTFA,
    switchData,
    verifyAppData,
    verifyApp,
    resetVerifyAppData,
    removeTFApp,
    removeTFAppData,
    resetRemoveTFAppData
  } = useTFApp();
  
  const handleSwitch = () => {
    if (!tfAppEnabled && !isChecked) {
      handleOpen();
    } else {
      switchTFA();
    }
  };

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    boxShadow: 24,
    padding: 0
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
      handleResetAppData();
      setIsOpen(false);
      //ожидание перед обновлением данных
      setTimeout(function () {
          setFirstFetch(true);
      }, 100);
  };

  const handleRemove = () => {
      handleResetAppData();
      removeTFApp();
  };

  const handleResetAppData = () => {
      resetVerifyAppData();
      resetRemoveTFAppData();
      setNotifData(null);
  };

  useEffect(() => {
    if (firstFetch) {
      getStatus();
      setFirstFetch(false);
    }

    if (status) {
      if (status.success) {
        setEnableTFA(status.message.enableTFA);
        setTfAppEnabled(status.message.tfAppEnabled);
        setIsChecked(enableTFA);
      } else {
        setNotifData({
          success: status.success,
          message: status.message
        });
      }
    }

    if (switchData) {
      if (switchData.success) {
        setEnableTFA(switchData.message.enableTFA);
        setTfAppEnabled(switchData.message.tfAppEnabled);
        setIsChecked(enableTFA);
      } else {
        setNotifData({
          success: switchData.success,
          message: switchData.message
        });
      }
    }

    if (removeTFAppData) {
        setNotifData({
            success: removeTFAppData.success,
            message: removeTFAppData.message
        });
    }

    if (verifyAppData) {
        setNotifData({
            success: verifyAppData.success,
            message: verifyAppData.message
        });
    }
  }, [enableTFA, firstFetch, getStatus, removeTFAppData, status, switchData, verifyAppData]);

  return <Card>
      {/*ERROR FROM SERVER*/}
      {notifData && <Alert severity={notifData.success ? "success" : "error"} variant="outlined" icon={notifData.success ? <NotificationAlert /> : <ErrorIcon />} sx={{ mb: 1.5 }}>
        <H6 fontSize={16}>{t(notifData.message)}</H6>
      </Alert>}
      <Box padding={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <H6 fontSize={14}>{t("2FA verification")}</H6>
          <Switch disabled={status && !status.success} checked={isChecked} onChange={handleSwitch} />
          {tfAppEnabled && <IconButton sx={{ padding: 0 }} onClick={handleRemove}>
            <DeleteIcon sx={{ color: "text.primary" }} />
          </IconButton>}
        </Stack>

        <Small color="text.secondary">
          {t("Two-factor authentication is an additional layer of security that ensures that only you can access your account, even if your password has become known to someone else.")}
        </Small>
      </Box>

      <Divider />

      <Box px={3} py={4}>
        <H5 fontSize={20}>{t("Setting up Google Authenticator or Authy")}</H5>
        <List sx={{ listStyle: "decimal", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>{t("Install Google Authenticator (IOS - Android) or Authy (IOS - Android).")}</ListItem>
            <ListItem sx={{ display: "list-item" }}>{t("In the authentication application, select the «+» icon.")}</ListItem>
            <ListItem sx={{ display: "list-item" }}>{t("Select «Scan Barcode (or QR Code)» and use your phone's camera to scan this barcode.")}</ListItem>
        </List>
      </Box>
      <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="modal-verification"
          aria-describedby="modal-send-verification-file">
          <Box sx={styleModal}>
              <Card sx={{ pl: 3, pr: 3 }}>
                  <AddTwoFactorApp
                      handleClose={handleClose}
                      tfAppData={tfAppData}
                      getTFAData={getTFAData}
                      verifyAppData={verifyAppData}
                      verifyApp={verifyApp}
                      handleResetVerifyAppData={handleResetAppData} />
              </Card>
          </Box>
      </Modal>
    </Card>;
};
export default TwoStepVerification;