import { useState, useEffect } from "react";
import { Box, Card, Grid, styled, Button, Divider, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM COMPONENTS
import { FlexBetween } from "components/flexbox";
import { H6, Paragraph } from "components/typography";
// CUSTOM DEFINED HOOK
import useCommissions from "hooks/useCommissions";
import { BorderAll } from "@mui/icons-material";

const StyledFlexBox = styled(FlexBetween)(({
    theme
}) => ({
    marginBottom: 30,
    [theme.breakpoints.down(750)]: {
        "& .MuiFormGroup-root": {
            marginBottom: 10
        }
    }
}));

const DefaultCommissonsPageView = () => {
    const {
        defaultCommissionsList,
        updateDefaultCommissions,
        defaultCommissionData,
        editDefaultCommission
    } = useCommissions();

    const [firstFetch, setFirstFetch] = useState(true);
    const [firstSetPercents, setFirstSetPercents] = useState(true);

    const initialValues = {
        defaultPercentClientBuy: 0,
        defaultPercentClientSell:0,
        defaultPercentOurBuy: 0,
        defaultPercentOurSell: 0
    };

    const validationSchema = Yup.object().shape({
        defaultPercentClientBuy: Yup.number().required("Client Percent Buy is Required!"),
        defaultPercentClientSell: Yup.number().required("Client Percent Buy is Required!"),
        defaultPercentOurBuy: Yup.number().required("Our Percent Buy is Required!"),
        defaultPercentOurSell: Yup.number().required("Our Percent Sell is Required!")
    });
    const {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            let defaultCommissionsBuy = defaultCommissionsList.find(c => c.offerType === 0);

            if (defaultCommissionsBuy &&
                (defaultCommissionsBuy.defaultPercentClient !== values.defaultPercentClientBuy ||
                defaultCommissionsBuy.defaultPercentOur !== values.defaultPercentOurBuy)) {
                let buyData = {
                    id: defaultCommissionsBuy.id,
                    percentClient: values.defaultPercentClientBuy,
                    percentOur: values.defaultPercentOurBuy
                };

                editDefaultCommission(buyData);
            }

            let defaultCommissionsSell = defaultCommissionsList.find(c => c.offerType === 1);

            if (defaultCommissionsSell &&
                (defaultCommissionsSell.defaultPercentClient !== values.defaultPercentClientSell ||
                defaultCommissionsSell.defaultPercentOur !== values.defaultPercentOurSell)) {
                let sellData = {
                    id: defaultCommissionsSell.id,
                    percentClient: values.defaultPercentClientSell,
                    percentOur: values.defaultPercentOurSell
                };

                editDefaultCommission(sellData);
            }
        }
    });

    useEffect(() => {
        if (firstFetch) {
            updateDefaultCommissions();
            setFirstFetch(false);
        }

        const intervalId = setInterval(() => {
            updateDefaultCommissions();
        }, 1000 * 10); // in milliseconds

        if (defaultCommissionsList.length > 0 && firstSetPercents) {
            let defaultCommissionsBuy = defaultCommissionsList.find(c => c.offerType === 0);
            let defaultCommissionsSell = defaultCommissionsList.find(c => c.offerType === 1);

            if (defaultCommissionsBuy && defaultCommissionsSell) {
                //Buy
                setFieldValue("defaultPercentClientBuy", defaultCommissionsBuy.defaultPercentClient);
                setFieldValue("defaultPercentOurBuy", defaultCommissionsBuy.defaultPercentOur);
                //Sell
                setFieldValue("defaultPercentClientSell", defaultCommissionsSell.defaultPercentClient);
                setFieldValue("defaultPercentOurSell", defaultCommissionsSell.defaultPercentOur);

                setFirstSetPercents(false);
            }
        }

        return () => clearInterval(intervalId)
    }, [defaultCommissionsList, firstFetch, firstSetPercents, setFieldValue, updateDefaultCommissions]);

    return <Box pt={2} pb={4}>
        <Card sx={{
            padding: 3
        }}>
            <H6 fontSize={16} mb={2}>
                Default Commissions
            </H6>

            <form onSubmit={handleSubmit}>
                <StyledFlexBox flexWrap="wrap">
                    <Box></Box>

                    <Box className="buttonWrapper">
                        <Button type="submit" variant="contained">
                            Save
                        </Button>
                    </Box>
                </StyledFlexBox>

                <Grid container spacing={3}>
                    <Grid item sm={6} xs={12}>
                        <Box marginBottom={2}>
                            <H6 fontSize={16}>Buy Default Commissions</H6>
                        </Box>

                        <Box marginBottom={2} sm={12}>
                            <TextField fullWidth type="number" name="defaultPercentClientBuy" label="Percent Client" onChange={handleChange} value={values.defaultPercentClientBuy} helperText={touched.defaultPercentClientBuy && errors.defaultPercentClientBuy} error={Boolean(touched.defaultPercentClientBuy && errors.defaultPercentClientBuy)} />
                        </Box>

                        <Box sm={12}>
                            <TextField fullWidth type="number" name="defaultPercentOurBuy" label="Percent Our" onChange={handleChange} value={values.defaultPercentOurBuy} helperText={touched.defaultPercentOurBuy && errors.defaultPercentOurBuy} error={Boolean(touched.defaultPercentOurBuy && errors.defaultPercentOurBuy)} />
                        </Box>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <Box marginBottom={2}>
                            <H6 fontSize={16}>Sell Default Commissions</H6>
                        </Box>

                        <Box marginBottom={2}>
                            <TextField fullWidth type="number" name="defaultPercentClientSell" label="Percent Client" onChange={handleChange} value={values.defaultPercentClientSell} helperText={touched.defaultPercentClientSell && errors.defaultPercentClientSell} error={Boolean(touched.defaultPercentClientSell && errors.defaultPercentClientSell)} />
                        </Box>

                        <Box>
                            <TextField fullWidth type="number" name="defaultPercentOurSell" label="Percent Our" onChange={handleChange} value={values.defaultPercentOurSell} helperText={touched.defaultPercentOurSell && errors.defaultPercentOurSell} error={Boolean(touched.defaultPercentOurSell && errors.defaultPercentOurSell)} />
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{
                    my: 4
                }} />

                <H6 fontSize={16}>Trader Default Commissions</H6>

                <Grid container spacing={3}>
                    <Grid item sm={6} xs={12}>
                        <FlexBetween my={1}>
                            <Paragraph fontWeight={500}>Sell</Paragraph>
                            <Paragraph fontWeight={500}>{(values.defaultPercentClientBuy - values.defaultPercentOurBuy).toFixed(3)}%</Paragraph>
                        </FlexBetween>
                    </Grid>

                    <Grid item sm={6} xs={12}>
                        <FlexBetween my={1}>
                            <Paragraph fontWeight={500}>Buy</Paragraph>
                            <Paragraph fontWeight={500}>{(values.defaultPercentClientSell - values.defaultPercentOurSell).toFixed(3)}%</Paragraph>
                        </FlexBetween>
                    </Grid>
                </Grid>
            </form>
        </Card>
    </Box>;
};
export default DefaultCommissonsPageView;