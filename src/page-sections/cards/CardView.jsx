import { useState, useEffect } from "react";
import { Card, Grid, Checkbox, TextField, Button, Autocomplete, IconButton, styled } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM COMPONENTS
import FlexBox from "components/flexbox/FlexBox";
import { H6, Paragraph } from "components/typography";
//CREDIT CARDS COMPONENT
import Cards from "react-credit-cards-2";
// CUSTOM HOOKS
import useNavigate from "hooks/useNavigate";
import CardHistory from "./CardHistory";
import useAuth from "hooks/useAuth";
import useCards from "hooks/useCards";
import useGroupsCards from "hooks/useGroupsCards";
import { useTranslation } from "react-i18next";

const StyledIconButton = styled(IconButton)(({
    theme
}) => ({
    backgroundColor: theme.palette.action.selected,
    border: `1px solid ${theme.palette.divider}`
}));

const CardViewCard = () => {
    const {
        cardsList,
        cardId,
        editCard,
        successEdit,
        resetEdit
    } = useCards();
    const {
        cardsGroups,
        setGroupId,
        updateCardsGroups
    } = useGroupsCards();
    const {
        user
    } = useAuth();
    const navigate = useNavigate();
    const {
        t
    } = useTranslation();

    const [firstFetch, setFirstFetch] = useState(true);
    const [nowCardGroup, setNowCardGroup] = useState(null);
    const cardData = cardsList.find(item => item.id === cardId);

    const validationSchema = Yup.object({
        isActive: Yup.boolean(),
    });

    const initialValues = cardData ? {
        ...cardData,
        isActive: cardData.fiatCardStatus === "ACTIVE"
        } : {
        cardGroup: "",
        isActive: false
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
            values.traderId = user.id;
            values.id = cardData.id;
            values.fiatCode = cardData.fiatCode;
            values.cardNumber = cardData.cardNumber;
            values.cardHolder = cardData.cardHolder;
            values.fiatCardStatus = values.isActive ? 0 : 1;
            values.fiatCardGroupId = nowCardGroup.id;
            values.fiatCardGroupName = nowCardGroup.name;
            editCard(values);
        }
    });

    useEffect(() => {
        if (!cardData) {
            return navigate("/dashboard/cards");
        }

        if (firstFetch) {
            updateCardsGroups();
            setFirstFetch(false);

            let findedGroup = cardsGroups.find(g => g.id === cardData.fiatCardGroupId);
            setNowCardGroup(findedGroup);
            setFieldValue("cardGroup", findedGroup ? findedGroup.name : "");
        }

        if (successEdit) {
            alert("Succcess edit.");
            resetEdit();
        }
    }, [cardData, cardId, cardsGroups, firstFetch, navigate, nowCardGroup, resetEdit, setFieldValue, successEdit, updateCardsGroups, values]);

    const handleGroupChange = (event) => {
        let newCardGroup = cardsGroups.find(g => g.name === event.target.value);

        if (newCardGroup && newCardGroup !== nowCardGroup) {
            setNowCardGroup(newCardGroup);
        }

        if (!newCardGroup) {
            setNowCardGroup(null);
        }

        handleChange(event);
    }

    const handleAutocompleteChange = (event, value) => {
        let newCardGroup = cardsGroups.find(g => g.name === value);

        if (newCardGroup && newCardGroup !== nowCardGroup) {
            setNowCardGroup(newCardGroup);
        }

        if (!value || value === "") {
            setNowCardGroup(null);
        }

        setFieldValue("cardGroup", value);
    };

    const handleGroupEdit = () => {
        setGroupId(nowCardGroup.id);
        navigate("/dashboard/cards/group-edit");
    };

    return cardData && !firstFetch && <Card sx={{
        padding: 2
    }}>
        <Grid container spacing={3}>
            {/* CREDITCARD VIEW */}
            <Grid item md={7} xs={12}
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center">
                <Cards
                    number={cardData.cardNumber}
                    expiry={""}
                    cvc={""}
                    name={cardData.cardHolder}
                    focused={""}
                />
            </Grid>

            {/* CREDIT CARD INFORMATION */}
            <Grid item md={5}>
                <form onSubmit={handleSubmit}>
                    <H6 fontSize={16} mb={3}>
                        {t("card Additional Parameters")}
                    </H6>

                    <Grid container spacing={2}>
                        <Grid item sm={11} xs={12}>
                            <Autocomplete
                                id="free-solo-card-group"
                                fullWidth
                                freeSolo
                                options={cardsGroups && cardsGroups.map((option) => option.name)}
                                sx={{ height: '40px' }}
                                value={values.cardGroup}
                                onChange={handleAutocompleteChange}
                                renderInput={(params) => (
                                    <TextField {...params}
                                        name="cardGroup"
                                        label={t("card cardGroup")}
                                        variant="outlined"
                                        value={values.cardGroup}
                                        onBlur={handleBlur}
                                        onChange={handleGroupChange}
                                        helperText={touched.cardGroup && errors.cardGroup}
                                        error={Boolean(touched.cardGroup && errors.cardGroup)} />
                                )}
                            />
                        </Grid>
                        <Grid item sm={1} xs={12}>
                            {nowCardGroup && <StyledIconButton size="small" onClick={handleGroupEdit} style={{ float: 'right', marginTop: '5px' }}>
                                <OpenInNewIcon />
                            </StyledIconButton>}
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

                    <Grid container sx={{ mt: '2rem' }} justifyContent="flex-end" alignItems="right">
                        <FlexBox flexWrap="wrap" gap={2}>
                            <Button type="submit" variant="contained">
                                {t("card Edit Card")}
                            </Button>

                            <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard/cards")}>
                                {t("card Cancel")}
                            </Button>
                        </FlexBox>
                    </Grid>
                </form>
            </Grid>
        </Grid>
        {/* CREDIT CARD HISTORY */}
        <CardHistory></CardHistory>
    </Card>;
};
export default CardViewCard;