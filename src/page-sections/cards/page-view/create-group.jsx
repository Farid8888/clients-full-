import { Fragment, useEffect, useState } from "react";
import { Box, Button, MenuItem, Card, Grid, TextField, Alert, IconButton, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "components/typography";
import FlexBox from "components/flexbox/FlexBox";
import { IconWrapper } from "components/icon-wrapper";
// CUSTOM ICON COMPONENT
import RectangleCirclePlus from "icons/duotone/RectangleCirclePlus";
import ErrorIcon from "icons/ErrorIcon";
import CardItem from "../CardItem";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
import useGroupsCards from "hooks/useGroupsCards";
import useCards from "hooks/useCards";

const StyledIconButton = styled(IconButton)(({
    theme
}) => ({
    backgroundColor: theme.palette.action.selected,
    border: `1px solid ${theme.palette.divider}`
}));

const CreateGroupCardPageView = () => {
    const {
        createCardGroup,
        createCardGroupData,
        resetCreateCardGroup
    } = useGroupsCards();

    const {
        ungroupedCards,
        updateUngroupedCards,
        resetUngroupedCards
    } = useCards();

    const [errorCreate, setErrorCreate] = useState(null);
    const [firstFetch, setFirstFetch] = useState(true);
    const [providersLimits, setProvidersLimits] = useState([]);
    const [providersMaxAmount, setProvidersMaxAmount] = useState([]);
    const [providersCards, setProvidersCards] = useState([]);

    const validationSchema = Yup.object({
        groupName: Yup.string().min(1).max(50).required("Group Name is Required!")
    });

    const initialValues = {
        groupName: "",
        cards: []
    };

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            values.cards.forEach(card => {
                let maxAmount = providersMaxAmount[card.groupProviderInfo.providerCode];
                let limit = providersLimits[card.groupProviderInfo.providerCode];
                let selectedLimits = groupLimits.find(v => v.value === limit);

                if (!selectedLimits) {
                    selectedLimits = groupLimits.find(v => v.value === 0);
                }

                card.groupProviderInfo.minOfferAmountLimit = selectedLimits.min;
                card.groupProviderInfo.maxOfferAmountLimit = selectedLimits.max;
                card.groupProviderInfo.maxAmount = maxAmount ? maxAmount : 0;
            });

            createCardGroup(values);
        }
    });
    
    const navigate = useNavigate();
    const {
        t
    } = useTranslation();
    
    const groupLimits = [
        {
            value: 0,
            label: "300-19000",
            min: 300,
            max: 19000
        },
        {
            value: 1,
            label: "19000-100000",
            min: 19000,
            max: 100000
        },
        {
            value: 2,
            label: "100000-300000",
            min: 100000,
            max: 300000
        }
    ];

    const handleAddCard = () => {
        values.cards.push({
            cardNumber: "",
            cardHolder: "",
            fiatCode: "RUB",
            isActive: true,
            isNew: true,
            groupProviderInfo: {
                providerCode: "",
                minOfferAmountLimit: 0,
                maxOfferAmountLimit: 0,
                maxAmount: 0
            }
        });
        setFieldValue("cards", values.cards);
    };

    const handleRemoveCard = () => {
        setFieldValue("cards", [
            ...values.cards.slice(0, -1),
        ]);
    };

    const handleSetLimits = (event, providerName) => {
        let newProvidersLimits = providersLimits;
        newProvidersLimits[`${providerName}`] = event.target.value

        setProvidersLimits(newProvidersLimits);
        handleChange(event);
    };

    const handleSetMaxLimits = (event, providerName) => {
        let newProvidersMaxAmount = providersMaxAmount;
        newProvidersMaxAmount[`${providerName}`] = event.target.value

        setProvidersMaxAmount(newProvidersMaxAmount);
        handleChange(event);
    };
    
    useEffect(() => {
        if (firstFetch) {
            resetUngroupedCards();
            updateUngroupedCards();
            setFirstFetch(false);
        }

        if (createCardGroupData && createCardGroupData.success) {
            resetCreateCardGroup();
            navigate("/dashboard/cards");
        } else if (createCardGroupData && !createCardGroupData.success) {
            setErrorCreate(createCardGroupData.message);
            resetCreateCardGroup();
        }

        if (values.cards) {
            let allProviders = [];
            values.cards.forEach(card => {
                if (card.groupProviderInfo.providerCode && !allProviders.includes(card.groupProviderInfo.providerCode)) {
                    allProviders.push(card.groupProviderInfo.providerCode);
                }
            });

            setProvidersCards(allProviders);
        }
    }, [createCardGroupData, firstFetch, navigate, resetCreateCardGroup, resetUngroupedCards, updateUngroupedCards, values.cards]);

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

                                    <H6 fontSize={16}>{t("Create New Card Group")}</H6>
                                </FlexBox>
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <Grid item sm={12} xs={12}>
                                    <TextField fullWidth name="groupName" label={t("cardGroup name")} value={values.groupName} onBlur={handleBlur} onChange={handleChange} helperText={touched.groupName && errors.groupName} error={Boolean(touched.groupName && errors.groupName)} />
                                </Grid>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                {values.cards.map((card, index) => <Fragment key={`card-added-${index}`}><CardItem
                                    cards={values.cards}
                                    card={card}
                                    index={index}
                                    setFieldValue={setFieldValue}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    touched={touched}
                                    errors={errors}
                                    ungroupedCards={ungroupedCards} /></Fragment>)}
                                {values.cards.length > 0 && <StyledIconButton size="small" onClick={handleRemoveCard} style={{ marginTop: '5px' }}>
                                    <Remove />
                                </StyledIconButton>}
                                <StyledIconButton size="small" onClick={handleAddCard} style={{ float: 'right', marginTop: '5px' }}>
                                    <Add />
                                </StyledIconButton>
                            </Grid>
                            
                            <Grid item md={6} xs={12}>
                                {providersCards.map((provider, index) => 
                                    <Fragment key={`card-provider-${index}`}>
                                      <Grid container spacing={2} pb={2.2}>
                                        <Grid item sm={2} xs={12}>
                                            <FlexBox gap ={0.5} alignItems="center">
                                                <Paragraph fontSize={16}>{provider}</Paragraph>
                                            </FlexBox>
                                        </Grid>

                                        <Grid item sm={5} xs={12}>
                                            <TextField
                                                fullWidth
                                                disabled={!provider}
                                                select
                                                name={`providersLimits.${provider}`}
                                                label={t("cardGroup limits")}
                                                value={providersLimits[`${provider}`]}
                                                onChange={event => handleSetLimits(event, provider)}
                                                helperText={touched.limits && errors.limits}
                                                error={Boolean(touched.limits && errors.limits)}>
                                                {groupLimits.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>

                                        <Grid item sm={5} xs={12}>
                                            <TextField 
                                                type="number"
                                                disabled={!provider}
                                                fullWidth 
                                                name={`providersMaxAmount.${provider}`}
                                                label={t("cardGroup maxAmount")}
                                                value={providersMaxAmount[`${provider}`]}
                                                onBlur={handleBlur}
                                                onChange={event => handleSetMaxLimits(event, provider)}
                                                helperText={touched.maxAmount && errors.maxAmount}
                                                error={Boolean(touched.maxAmount && errors.maxAmount)} />
                                        </Grid>
                                      </Grid>
                                    </Fragment>
                                )}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <FlexBox flexWrap="wrap" gap={2}>
                        <Box>
                            <Button type="submit" variant="contained">
                                {t("card Create New Card Group")}
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
export default CreateGroupCardPageView;