import { useState } from 'react';
import { H6 } from "components/typography";
import Modal from '@mui/material/Modal';
import { Box, Button, Card, Grid, TextField } from "@mui/material";
import { FlexBox } from "components/flexbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
//CREDIT CARDS COMPONENT
import Cards from "react-credit-cards-2";
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

export default function BuyOfferModal(props) {
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
    completeOffer,
  } = useOffers();

  const validationSchema = Yup.object({
    amountFiat: Yup.number()
  });
  const initialValues = {
      amountFiat: offer.amountFiat
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {completeOffer(offer.id, values.amountFiat);}
  });

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

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <Cards
                        number={offer.fiatInfos.cardNumber}
                        expiry={""}
                        cvc={""}
                        name={offer.fiatInfos.cardHolder}
                        focused={""}
                    />
                </Grid>

                <Grid item md={6} xs={12}>
                    <TextField 
                    fullWidth 
                    name="amount" 
                    defaultValue={offer.amountToken} 
                    label={"Amount " + offer.tokenCode} 
                    disabled={true}
                    />
                </Grid>

                <Grid item md={6} xs={12}>
                    <TextField 
                    fullWidth 
                    name="amountFiat" 
                    defaultValue={values.amountFiat} 
                    label={"Amount " + offer.fiatInfos.providerCode} 
                    onChange={handleChange}
                    disabled={!enabledEditAmount}
                    helperText={touched.amountFiat && errors.amountFiat}
                    error={Boolean(touched.amountFiat && errors.amountFiat)}
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

                <Grid item xs={12}>
                  <FlexBox alignItems="center" gap={2}>
                    <Button type="submit">Apply</Button>

                    <Button color="secondary" variant="outlined" onClick={handleClose}>
                      Cancel
                    </Button>
                  </FlexBox>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}