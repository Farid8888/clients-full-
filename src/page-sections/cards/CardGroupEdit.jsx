import { Fragment, useEffect, useState } from "react";
import { Box, Button, MenuItem, Card, Grid, TextField, Alert, IconButton, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "components/typography";
import FlexBox from "components/flexbox/FlexBox";
import { IconWrapper } from "components/icon-wrapper";
import CardItem from "./CardItem";
// CUSTOM ICON COMPONENT
import RectangleCirclePlus from "icons/duotone/RectangleCirclePlus";
import ErrorIcon from "icons/ErrorIcon";
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

const EditGroupCardPageView = () => {
    const {
        cardsGroups,
        groupId,
        editCardGroup,
        editCardGroupData,
        resetEditCardGroup
    } = useGroupsCards();

    const {
        cardsByGroup,
        updateCardsByGroup,
        resetCardsByGroup,
        ungroupedCards,
        updateUngroupedCards,
        resetUngroupedCards,
        editCard
    } = useCards();

    const [firstFetch, setFirstFetch] = useState(true);
    const [cardsNotSet, setCardsNotSet] = useState(true);
    const [limitsNotSet, setLimitsNotSet] = useState(true);
    const [errorEdit, setErrorEdit] = useState(null);
    const [providersLimits, setProvidersLimits] = useState([]);
    const [providersMaxAmount, setProvidersMaxAmount] = useState([]);
    const [providersCards, setProvidersCards] = useState([]);

    const groupData = cardsGroups.find(item => item.id === groupId);

    const validationSchema = Yup.object({
        groupName: Yup.string().min(1).max(50).required("Group Name is Required!")
    });

    const initialValues = {
        id: groupId,
        groupName: groupData ? groupData.name : "",
        status: groupData ? groupData.fiatGroupStatus : 0,
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
                let maxAmount = providersMaxAmount[card.providerCode];
                let limit = providersLimits[card.providerCode];
                let selectedLimits = groupLimits.find(v => v.value === limit);

                if (!selectedLimits) {
                    selectedLimits = groupLimits.find(v => v.value === 0);
                }

                card.fiatCardGroupId = groupId;

                card.groupProviderInfo = {
                    minOfferAmountLimit: selectedLimits.min,
                    maxOfferAmountLimit: selectedLimits.max,
                    maxAmount: maxAmount ? maxAmount : 0,
                };
            });

            let selectedStatus = groupStatuses.find(v => v.value === values.status);
            values.fiatGroupStatus = selectedStatus.statusId;

            editCardGroup(values);
            setFirstFetch(true);
            setCardsNotSet(true);
            setLimitsNotSet(true);
        }
    });

    const navigate = useNavigate();
    const {
        t
    } = useTranslation();

    const groupStatuses = [{
        id: 1,
        name: "Active",
        value: "ACTIVE",
        statusId: 0
    }, {
        id: 2,
        name: "Pause",
        value: "PAUSE",
        statusId: 1
    }];

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
        let oldCards = values.cards.filter(c => !c.isNew);
        let newCards = values.cards.filter(c => c.isNew);

        setFieldValue("cards", [
            ...oldCards,
            ...newCards.slice(0, -1),
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

    const handleUngroupCard = cardInfo => {
        editCard(cardInfo);
        let oldCards = values.cards.filter(c => !c.isNew && c.id !== cardInfo.id);
        let newCards = values.cards.filter(c => c.isNew);

        setFieldValue("cards", [
            ...oldCards,
            ...newCards
        ]);

        // ожидание перед обновлением
        setTimeout(function () {
            setFirstFetch(true);
            setCardsNotSet(true);
            setLimitsNotSet(true);
        }, 200);
    };

    useEffect(() => {
        if (!groupData) {
            return navigate("/dashboard/cards");
        }

        if (firstFetch) {
            resetCardsByGroup();
            updateCardsByGroup(groupData.id);
            resetUngroupedCards();
            updateUngroupedCards();
            setProvidersLimits([]);
            setProvidersMaxAmount([]);
            setProvidersCards([]);
            setFirstFetch(false);
        }

        if (cardsByGroup.length > 0 && cardsNotSet && !firstFetch) {
            setFieldValue('cards', cardsByGroup.map(card => {
                return { ...card, isActive: card.fiatCardStatus === "ACTIVE" }
            }));
            setCardsNotSet(false);
        }

        if (editCardGroupData && editCardGroupData.success) {
            resetEditCardGroup();
            navigate("/dashboard/cards");
        } else if (editCardGroupData && !editCardGroupData.success) {
            setErrorEdit(editCardGroupData.message);
            resetEditCardGroup();
        }
        
        if (values.cards && !firstFetch) {
            let allProviders = [];

            // первоначальная установка лимитов
            if (limitsNotSet && groupData) {
                let limitsIsSet = false;

                values.cards.forEach(card => {
                    if (!card.isNew) {
                        let providerLimits = groupData.groupProviders.find(pl => pl.providerCode === card.providerCode);

                        if (providerLimits) {
                            let oldLimits = groupLimits.find(val => val.min === providerLimits.minOfferAmountLimit && val.max === providerLimits.maxOfferAmountLimit);

                            if (oldLimits) {
                                let newProvidersLimits = providersLimits;
                                newProvidersLimits[`${card.providerCode}`] = oldLimits.value

                                setProvidersLimits(newProvidersLimits);

                                let newProvidersMaxAmount = providersMaxAmount;
                                newProvidersMaxAmount[`${card.providerCode}`] = providerLimits.maxAmount;

                                setProvidersMaxAmount(newProvidersMaxAmount);

                                limitsIsSet = true;
                            }
                        }
                    }
                });

                setLimitsNotSet(!limitsIsSet);
            }

            values.cards.forEach(card => {
                if (card.providerCode && !allProviders.includes(card.providerCode)) {
                    allProviders.push(card.providerCode);
                }
            });

            setProvidersCards(allProviders);
        }
    }, [cardsByGroup, cardsNotSet, editCardGroupData, firstFetch, groupData, limitsNotSet, navigate, providersLimits, providersMaxAmount, resetCardsByGroup, resetEditCardGroup, resetUngroupedCards, setFieldValue, updateCardsByGroup, updateUngroupedCards, values.cards]);

    return <Box pt={2} pb={4}>
        {/*ERROR FROM SERVER*/}
        {errorEdit && <Alert severity="error" variant="outlined" icon={<ErrorIcon />} sx={{ mb: 1.5 }}>
            <H6 fontSize={16}>{t(errorEdit)}</H6>
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

                                    <H6 fontSize={16}>{t("cardGroup Edit Card Group")}</H6>
                                </FlexBox>
                            </Grid>

                            <Grid item md={12} xs={12}>
                                <Grid item sm={12} xs={12}>
                                    <TextField fullWidth name="groupName" label={t("cardGroup name")} value={values.groupName} onBlur={handleBlur} onChange={handleChange} helperText={touched.groupName && errors.groupName} error={Boolean(touched.groupName && errors.groupName)} />
                                </Grid>
                            </Grid>

                            <Grid item sm={12} xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    name="status"
                                    label={t("cardGroup status")}
                                    value={values.status}
                                    onChange={handleChange}
                                    helperText={touched.status && errors.status}
                                    error={Boolean(touched.status && errors.status)}>
                                    {groupStatuses.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                    ungroupedCards={ungroupedCards}
                                    handleUngroupCard={handleUngroupCard} /></Fragment>)}
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
                                                <FlexBox gap={0.5} alignItems="center">
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
                                                    value={providersLimits[`${provider}`] ? providersLimits[`${provider}`] : "0"}
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
                                                    value={providersMaxAmount[`${provider}`] ? providersMaxAmount[`${provider}`] : ""}
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
                                {t("Edit Card Group")}
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
export default EditGroupCardPageView;