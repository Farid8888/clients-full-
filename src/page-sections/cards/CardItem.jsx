import { useEffect, useState } from "react";
import { Box, Checkbox, Grid, TextField, Alert, styled, IconButton, Autocomplete } from "@mui/material";
import { Remove } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { H6, Paragraph } from "components/typography";
// CUSTOM ICON COMPONENT
import ErrorIcon from "icons/ErrorIcon";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
import useCards from "hooks/useCards";

const StyledIconButton = styled(IconButton)(({
    theme
}) => ({
    backgroundColor: theme.palette.action.selected,
    border: `1px solid ${theme.palette.divider}`
}));

const CardItem = (props) => {
    const {
        cards,
        card,
        index,
        setFieldValue,
        handleBlur,
        handleChange,
        touched,
        errors,
        ungroupedCards,
        handleUngroupCard
    } = props;

    const {
        t
    } = useTranslation();
    const {
        providerData,
        checkProviderCard,
        clearProviderData
    } = useCards();

    const [error, setError] = useState(null);
    const [cardChecked, setCardChecked] = useState("");
    const [thisProviderData, setThisProviderData] = useState(null);

    const handleCardNumberChange = (event) => {
        if (event.target.value.length === 16) {
            let selectedCard = ungroupedCards.find(g => g.cardNumber === event.target.value);

            if (selectedCard) {
                if (!cards.find(c => c.cardNumber === selectedCard.cardNumber)) {
                    setCardFromUngrouped(selectedCard);
                } else {
                    setCardChecked("error");
                }
            } else {
                checkProviderCard(event.target.value, index);
            }
        } else {
            setCardChecked("");
            setFieldValue(`cards.${index}.providerCode`, "");
            setFieldValue(`cards.${index}.groupProviderInfo.providerCode`, "");
            setThisProviderData(null);
            clearProviderData(index);
        }
        
        handleChange(event);
    };

    const setCardFromUngrouped = (addedCard) => {
        setFieldValue(`cards.${index}.isNew`, false);
        setFieldValue(`cards.${index}.id`, addedCard.id);
        setFieldValue(`cards.${index}.cardHolder`, addedCard.cardHolder);
        setFieldValue(`cards.${index}.cardNumber`, addedCard.cardNumber);
        setFieldValue(`cards.${index}.fiatCardStatus`, addedCard.fiatCardStatus);
        setFieldValue(`cards.${index}.fiatCode`, addedCard.fiatCode);
        setFieldValue(`cards.${index}.traderId`, addedCard.traderId);
        setFieldValue(`cards.${index}.providerCode`, addedCard.providerCode);
        setFieldValue(`cards.${index}.groupProviderInfo.providerCode`, addedCard.providerCode);
    };

    const handleAutocompleteChange = (event, value) => {
        if (value) {
            let selectedCard = ungroupedCards.find(g => g.id === value.id);

            if (!cards.find(c => c.cardNumber === selectedCard.cardNumber)) {
                setCardFromUngrouped(selectedCard);
            } else {
                setCardChecked("error");
            }
        } else {
            setCardChecked("");
            setThisProviderData(null);
            clearProviderData(index);
        }
    };

    if (!thisProviderData && providerData[index]) {
        setThisProviderData(providerData[index]);
    }

    useEffect(() => {
        if (thisProviderData && card.cardNumber.toString().length === 16 && card.isNew) {
            setCardChecked(thisProviderData.success ? "success" : "error");

            let providerCode = thisProviderData.success ? thisProviderData.providerCode : "";
            
            setFieldValue(`cards.${index}.providerCode`, providerCode);
            setFieldValue(`cards.${index}.groupProviderInfo.providerCode`, providerCode);
            setFieldValue(`cards.${index}.fiatCode`, thisProviderData.success ? "RUB" : "");
            if (!thisProviderData.success) {
                setError(thisProviderData.message);
            } else {
                setError(null);
                setThisProviderData(null);
                clearProviderData(index);
            }
        }
    }, [card.cardNumber, card.isNew, clearProviderData, index, setFieldValue, thisProviderData]);

    return <Box pb={2}>
        {/*ERROR FROM SERVER*/}
        {error && <Alert severity="error" variant="outlined" icon={<ErrorIcon />} sx={{ mb: 1 }}>
            <H6 fontSize={16}>{t(error)}</H6>
        </Alert>}
        <Grid container spacing={1.5}>
            {!card.isNew && <Grid item sm={1} xs={12}>
                <StyledIconButton size="small" onClick={() => {
                    card.fiatCardGroupName = "";
                    card.fiatCardGroupId = "";
                    handleUngroupCard(card)
                }} style={{ marginTop: '5px' }}>
                    <Remove />
                </StyledIconButton>
            </Grid>}
            <Grid item sm={5} xs={12}>
                {card.isNew &&
                <Autocomplete
                    id={`free-solo-cards-${index}`}
                    fullWidth
                    freeSolo
                    getOptionLabel={(option) => option.name}
                    options={ungroupedCards ? ungroupedCards.map((option) => {
                        return { id: option.id, name: option.cardNumber };
                    }) : []}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            {option.name}
                        </Box>
                    )}
                    onChange={handleAutocompleteChange}
                    renderInput={(params) => (
                        <TextField {...params}
                            type="number"
                            name={`cards.${index}.cardNumber`}
                            label={t("card cardNumber") + (" " + card.providerCode)}
                            variant="outlined"
                            value={card.cardNumber ? card.cardNumber : ""}
                            color={cardChecked}
                            focused
                            onBlur={handleBlur}
                            onChange={handleCardNumberChange}
                            helperText={touched.cardGroup && errors.cardGroup}
                            error={Boolean(touched.cardGroup && errors.cardGroup)} />
                    )}
                />}
                {!card.isNew &&
                    <TextField
                        fullWidth
                        type="number"
                        disabled={true}
                        name={`cards.${index}.cardNumber`}
                        label={t("card cardNumber") + (" " + card.providerCode)}
                        variant="outlined"
                        value={card.cardNumber}
                        color={cardChecked}
                        focused
                        onBlur={handleBlur}
                        helperText={touched.cardGroup && errors.cardGroup}
                        error={Boolean(touched.cardGroup && errors.cardGroup)} />}
            </Grid>

            <Grid item sm={card.isNew ? 5 : 4} xs={12}>
                <TextField fullWidth disabled={!card.isNew} name={`cards.${index}.cardHolder`} label={t("card cardHolder")} value={card.cardHolder} onBlur={handleBlur} onChange={handleChange} helperText={touched.cardHolder && errors.cardHolder} error={Boolean(touched.cardHolder && errors.cardHolder)} />
            </Grid>

            <Grid item sm={card.isNew ? 2 : 1} xs={12}>
                <Paragraph fontWeight={500}>{t("card isActive")}</Paragraph>
                <Checkbox sx={{
                    p: 0
                }} name={`cards.${index}.isActive`} value={card.isActive} onChange={handleChange} checked={card.isActive} />
            </Grid>
        </Grid>
    </Box>;
};
export default CardItem;