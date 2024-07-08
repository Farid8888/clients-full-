import { useState } from 'react';
import { H6 } from "components/typography";
import Modal from '@mui/material/Modal';
import { Box, Button, Card, Grid, TextField } from "@mui/material";
import { FlexBox } from "components/flexbox";
import { useTranslation } from "react-i18next";
import useOffers from "hooks/useOffers";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    boxShadow: 24,
    padding: 0
};

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

export default function VerifInfoModal(props) {
    const {
        offer,
        nowStatus
    } = props;

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {
        t
    } = useTranslation();
    const {
        completeVerification,
    } = useOffers();

    const verificationOffer = (offerStatus) => {
        completeVerification({ offerStatus, offerId: offer.id });
        handleClose();
    };

    const offerTypes = {
        BUY: 0,
        SELL: 1,
    }

    var offerType = getEnumKeyByEnumValue(offerTypes, offer.type);
    var enabledEditAmount = offer.type === 1 && offer.status === 2 && offer.status === 5;

    return (
        <div>
            <Button sx={{ minWidth: 100, marginBottom: 1 }} onClick={() => { handleOpen(); }}>{t("View order")}</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} py={3}>
                    <Card sx={{ p: 3 }}>
                        <H6 fontSize={18} sx={{ mb: 2 }}>{t("Order Details")}</H6>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="traderName"
                                    defaultValue={offer.traderName}
                                    label={"Trader Name"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="clientName"
                                    defaultValue={offer.clientName}
                                    label={"Client Name"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="traderCard"
                                    defaultValue={offer.fiatInfos.cardNumber}
                                    label={"Trader Card Number"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="providerCode"
                                    defaultValue={offer.fiatInfos.providerCode}
                                    label={"Trader Provider Code"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="amountFiat"
                                    defaultValue={offer.amountFiat}
                                    label={"Amount " + offer.fiatInfos.providerCode}
                                    disabled={!enabledEditAmount}
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="offerType"
                                    defaultValue={t(offerType)}
                                    label={"Offer Type"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="offerStatus"
                                    defaultValue={t(nowStatus)}
                                    label={"Offer Status"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="createdAt"
                                    defaultValue={new Date(offer.createdAt * 1000).toLocaleString()}
                                    label={"Date Created"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="updatedAt"
                                    defaultValue={new Date(offer.updatedAt * 1000).toLocaleString()}
                                    label={"Last Updated"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="visitorCardHolder"
                                    defaultValue={offer.visitorCardHolder}
                                    label={"Visitor Card Holder"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="visitorCardNumber"
                                    defaultValue={offer.visitorCardNumber}
                                    label={"Visitor Card Number"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="visitorCardProvider"
                                    defaultValue={offer.visitorCardProvider}
                                    label={"Visitor Card Provider"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    fullWidth
                                    name="visitorId"
                                    defaultValue={offer.visitorId}
                                    label={"Visitor Id"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <TextField
                                    multiline
                                    fullWidth
                                    name="comment"
                                    defaultValue={offer.message}
                                    label={"Comment"}
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    multiline
                                    fullWidth
                                    name="verificationUrl"
                                    defaultValue={offer.verificationUrl}
                                    label={"Verification Url"}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FlexBox alignItems="center" gap={2}>
                                    <Button color="success" onClick={() => { verificationOffer(3); }}>SUCCESS</Button>
                                    <Button color="warning" onClick={() => { verificationOffer(14); }}>CLOSE</Button>
                                    <Button color="error" onClick={() => { verificationOffer(11); }}>BAN</Button>

                                    <Button color="secondary" variant="outlined" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </FlexBox>
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </Modal>
        </div>
    );
}