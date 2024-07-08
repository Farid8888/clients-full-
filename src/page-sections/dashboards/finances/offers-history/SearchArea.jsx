import { useState } from "react";
import { TextField, Grid, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import Search from "@mui/icons-material/Search";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
// CUSTOM COMPONENTS
import { FlexBetween } from "components/flexbox";

// ==========================================================================================

// ==========================================================================================

const OFFER_STATUS = [{
    id: 1,
    name: "All",
    value: ""
}, {
    id: 2,
    name: "COMPLETE",
    value: 3
}, {
    id: 3,
    name: "REJECTED",
    value: 4
}, {
    id: 4,
    name: "DEAD_VALIDATION",
    value: 6
}, {
    id: 5,
    name: "CANCEL",
    value: 10
}, {
    id: 6,
    name: "BAN",
    value: 11
}, {
    id: 7,
    name: "CANCEL_FRAUD",
    value: 12
}, {
    id: 8,
    name: "CANCEL_VERIFICATION",
    value: 14
}];

const SearchArea = props => {
    const {
        filter,
        handleChangeFilter
    } = props;

    const [startDatePicker, setStartDatePicker] = useState(new Date().setHours(0, 0, 0, 0));
    const [endDatePicker, setEndDatePicker] = useState(new Date().setHours(0, 0, 0, 0));

    const {
        t
    } = useTranslation();
    
    const handleSetStartDate = (value) => {
        let newDate = new Date(value);
        newDate.setHours(0, 0, 0, 0);

        if (newDate > endDatePicker) {
            newDate = endDatePicker;
        }

        setStartDatePicker(newDate);

        handleChangeFilter("dateStart", newDate.getTime() / 1000);
    };

    const handleSetEndDate = (value) => {
        let newDate = new Date(value);
        newDate.setHours(0, 0, 0, 0);

        if (newDate < startDatePicker) {
            newDate = startDatePicker;
        }

        setEndDatePicker(newDate);

        handleChangeFilter("dateEnd", newDate.getTime() / 1000);
    };
    
    return <FlexBetween gap={1} mt={3} mb={1}>
        <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
                <TextField select fullWidth label={t("Status")} className="select" value={filter.status} onChange={e => handleChangeFilter("status", e.target.value)}>
                    {OFFER_STATUS.map(({
                        id,
                        name,
                        value
                    }) => <MenuItem key={id} value={value}>
                            {t(name)}
                    </MenuItem>)}
                </TextField>
            </Grid>
            {/* SEARCH BOX */}
            <Grid item md={5} sm={6} xs={12}>
                <TextField value={filter.search} onChange={e => handleChangeFilter("search", e.target.value)} placeholder={t("Search...")} InputProps={{
                    startAdornment: <Search />
                }} sx={{
                    maxWidth: 400,
                    width: "100%"
                }} />
            </Grid>


            <Grid item md={2} sm={6} xs={12}>
                <DatePicker label={t("Order Date Start")} value={dayjs(startDatePicker)} onChange={handleSetStartDate} renderInput={params => <TextField {...params} fullWidth />} />
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
                <DatePicker label={t("Order Date End")} value={dayjs(endDatePicker)} onChange={handleSetEndDate} renderInput={params => <TextField {...params} fullWidth />} />
            </Grid>
        </Grid>
    </FlexBetween>;
};
export default SearchArea;