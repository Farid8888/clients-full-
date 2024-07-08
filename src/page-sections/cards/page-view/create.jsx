import { useEffect, useState } from "react";
import { Box, Button, MenuItem, Checkbox, Card, Grid, TextField, Autocomplete, Alert } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "components/typography";
import FlexBox from "components/flexbox/FlexBox";
import { IconWrapper } from "components/icon-wrapper";
// CUSTOM ICON COMPONENT
import RectangleCirclePlus from "icons/duotone/RectangleCirclePlus";
import ErrorIcon from "icons/ErrorIcon";

// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import useCards from "hooks/useCards";
import useGroupsCards from "hooks/useGroupsCards";

const CreateCardPageView = () => {
  const {
    user
  } = useAuth();
  const {
    createCard,
    cardData,
    resetCardData
  } = useCards();

  const {
    cardsGroups,
    updateCardsGroups,
  } = useGroupsCards();

  const [firstFetch, setFirstFetch] = useState(true);
  const [errorCreate, setErrorCreate] = useState(null);
  const [nowCardGroup, setNowCardGroup] = useState(null);

  const validationSchema = Yup.object({
    fiatCode: Yup.string().required("Fiat Code is Required!"),
    cardNumber: Yup.string().min(16).max(16).required("Card Number is Required!"),
    cardHolder: Yup.string().max(50).required("Card Holder is Required!"),
    amountLimitPerDay: Yup.number(),
    maxOperationsLimitPerDay: Yup.number(),
    isActive: Yup.boolean(),
  });
  const initialValues = {
    fiatCode: "RUB",
    cardNumber: "",
    cardHolder: "",
    cardGroup: "",
    amountLimitPerDay: 0,
    maxOperationsLimitPerDay: 0,
    isActive: true
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
        values.traderId = user.id;
        values.fiatCardStatus = values.isActive ? 0 : 1;
        values.fiatCardGroupId = nowCardGroup.id;
        values.fiatCardGroupName = nowCardGroup.name;
        createCard(values);
    }
  });

  const navigate = useNavigate();
  const {
    t
  } = useTranslation();

  const providerCodes = [];
  const fiatCodes = [
    {
        value: "RUB",
        label: "RUB",
    }
  ];

  user && user.fiatPermissions.map(({
    canBuy,
    canSell,
    code,
    name
  }) => {
    if (canBuy || canSell) {
        providerCodes.push({
            value: code,
            label: name,
        })
    }
        
    return 0;
  });

  useEffect(() => {
    if (firstFetch) {
        updateCardsGroups();
        setFirstFetch(false);
    }

    if (cardData && cardData.success) {
        resetCardData();
        navigate("/dashboard/cards");
    } else if (cardData && !cardData.success) {
        setErrorCreate(cardData.message);
        resetCardData();
    }
  }, [cardData, firstFetch, navigate, resetCardData, updateCardsGroups]);

  const handleAutocompleteChange = (event, value) => {
      if (value) {
          let selectedGroup = cardsGroups.find(g => g.id === value.id);
          setNowCardGroup(selectedGroup);
          values.cardGroup = selectedGroup.name;
          values.amountLimitPerDay = selectedGroup.minOfferAmountLimit;
          values.maxOperationsLimitPerDay = selectedGroup.maxOfferAmountLimit;
      } else {
          values.cardGroup = "";
          values.amountLimitPerDay = 0;
          values.maxOperationsLimitPerDay = 0;
          setNowCardGroup(null);
      }
  };

  return <Box pt={2} pb={4}>
      {/*ERROR FROM SERVER*/}
      {errorCreate && <Alert severity="error" variant="outlined" icon={<ErrorIcon />} sx={{ mb: 1.5 }}>
           <H6 fontSize={16}>{t(errorCreate)}</H6>
        </Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{
            p: 3
          }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FlexBox gap={0.5} alignItems="center">
                    <IconWrapper sx={{ bgcolor: "transparent" }}>
                      <RectangleCirclePlus sx={{
                      color: "primary.main",
                    }} />
                    </IconWrapper>

                    <H6 fontSize={16}>{t("Create New Card")}</H6>
                  </FlexBox>
                </Grid>

                <Grid item md={6} xs={12}>
                  <H6 fontSize={16} mb={3}>
                    {t("card Main Parameters")}
                  </H6>
                  
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                        <TextField
                            fullWidth
                            select
                            name="fiatCode"
                            label={t("card fiatCode")}
                            defaultValue="RUB"
                            value={values.fiatCode}
                            onChange={handleChange}
                            helperText={touched.fiatCode && errors.fiatCode}
                            error={Boolean(touched.fiatCode && errors.fiatCode)}>
                            {fiatCodes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item sm={12} xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        name="cardNumber"
                        label={t("card cardNumber")}
                        value={values.cardNumber}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{
                          pattern: "[0-9]*",
                        }}
                        helperText={touched.cardNumber && errors.cardNumber}
                        error={Boolean(touched.cardNumber && errors.cardNumber)} />
                    </Grid>
                    
                    <Grid item sm={12} xs={12}>
                      <TextField fullWidth name="cardHolder" label={t("card cardHolder")} value={values.cardHolder} onBlur={handleBlur} onChange={handleChange} helperText={touched.cardHolder && errors.cardHolder} error={Boolean(touched.cardHolder && errors.cardHolder)} />
                    </Grid>
                    <Grid item sm={12} xs={12}>
                        <Autocomplete
                            id="free-solo-card-group"
                            fullWidth
                            freeSolo
                            getOptionLabel={(option) => option.name}
                            options={cardsGroups && cardsGroups.map((option) => {
                                return { id: option.id, name: option.name };
                            })}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                    {option.name}
                                </Box>
                            )}
                            sx={{ height: '40px' }}
                            onChange={handleAutocompleteChange}
                            renderInput={(params) => (
                                <TextField {...params}
                                    name="cardGroup"
                                    label={t("card cardGroup")}
                                    variant="outlined"
                                    value={values.cardGroup}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    helperText={touched.cardGroup && errors.cardGroup}
                                    error={Boolean(touched.cardGroup && errors.cardGroup)} />
                            )}
                        />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={6} xs={12}>
                  <H6 fontSize={16} mb={3}>
                    {t("card Additional Parameters")}
                  </H6>

                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                      <TextField fullWidth disabled={true} name="amountLimitPerDay" label={t("card amountLimitPerDay")} value={values.amountLimitPerDay} onBlur={handleBlur} onChange={handleChange} helperText={touched.amountLimitPerDay && errors.amountLimitPerDay} error={Boolean(touched.amountLimitPerDay && errors.amountLimitPerDay)} />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <TextField fullWidth disabled={true} name="maxOperationsLimitPerDay" label={t("card maxOperationsLimitPerDay")} value={values.maxOperationsLimitPerDay} onBlur={handleBlur} onChange={handleChange} helperText={touched.maxOperationsLimitPerDay && errors.maxOperationsLimitPerDay} error={Boolean(touched.maxOperationsLimitPerDay && errors.maxOperationsLimitPerDay)} />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FlexBox alignItems="center" gap={1}>
                            <Checkbox sx={{
                                p: 0
                            }} name="isActive" value={values.isActive} onChange={handleChange} checked={values.isActive} />
                            <Paragraph fontWeight={500}>{t("card isActive")}</Paragraph>
                        </FlexBox>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <FlexBox flexWrap="wrap" gap={2}>
              <Box>
                  <Button type="submit" variant="contained">
                    {t("card Create New Card")}
                  </Button>
              </Box>

              <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard/cards")}>
                {t("card Cancel")}
              </Button>
            </FlexBox>
          </Grid>
        </Grid>
      </form>
    </Box>;
};
export default CreateCardPageView;