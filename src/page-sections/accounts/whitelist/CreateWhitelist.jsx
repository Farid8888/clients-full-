import { Box, Card, Grid, Button, Stack, TextField } from "@mui/material";
// CUSTOM COMPONENTS
import { Paragraph } from "components/typography";
import { FlexBox } from "components/flexbox";
import { useFormik } from "formik";
import * as Yup from "yup";
// CUSTOM ICON COMPONENTS
import HomeOutlined from "icons/HomeOutlined";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";

const CreateWhitelist = (props) => {
    const {
        handleClose,
        createWhitelist,
        setFirstFetch
    } = props;

    const {
        t
    } = useTranslation();
    const validationSchema = Yup.object({
        ipAddress: Yup.string().min(7).max(15).required("IpAddress is Required!"),
    });
    const initialValues = {
        ipAddress: "",
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
            createWhitelist(values.ipAddress);

            // ожидание перед обновлением и закрытием
            setTimeout(function () {
                setFirstFetch(true);
                handleClose();
            }, 100);
        }
    });

    return <Card sx={{
        padding: 2,
        display: "flex",
        boxShadow: "none",
        alignItems: "center",
        borderColor: "divider",
        justifyContent: "space-between"
    }}>
        <form onSubmit={handleSubmit}>
            <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <HomeOutlined sx={{
                        color: "grey.400"
                    }} />
                    <Paragraph fontWeight={500}>{t("Add New IP Address")}</Paragraph> 
                </Stack>

                <Paragraph mt={1} mb={1} color="grey.500">
                    {t("Adding a new IP address to restrict access to the API.")}
                </Paragraph>

                <TextField
                    fullWidth
                    name="ipAddress"
                    label={t("Ip Address")}
                    onBlur={handleBlur}
                    value={values.ipAddress}
                    onChange={handleChange}
                    helperText={touched.ipAddress && errors.ipAddress}
                    error={Boolean(touched.ipAddress && errors.ipAddress)}>
                </TextField>

                <Grid item xs={12} mt={1}>
                    <FlexBox alignItems="center" gap={2}>
                        <Button type="submit">{t("Add")}</Button>

                        <Button color="secondary" variant="outlined" onClick={handleClose}>
                            {t("Cancel")}
                        </Button>
                    </FlexBox>
                </Grid>
            </Box>
        </form>
    </Card>;
};
export default CreateWhitelist;