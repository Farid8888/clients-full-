import { useState } from "react";
import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel, FormControlLabel, FormGroup } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
// CUSTOM COMPONENT
import { Span } from "components/typography";
import { TableMoreMenu } from "components/table";
// CUSTOM UTILS METHOD
import { isDark } from "utils/constants";
import { useTranslation } from "react-i18next";
import { FlexBox } from "components/flexbox";

// ==============================================================

// ==============================================================
const headCells = [{
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Id / Human Id"
}, {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
    filters: [
        {
            value: 8,
            label: "VERIFICATION"
        },
        {
            value: 9,
            label: "VERIFICATION_BAN"
        },
    ]
}, {
    id: "fiatInfos.cardNumber",
    numeric: true,
    disablePadding: false,
    label: "Requisites"
}, {
    id: "amountSend",
    numeric: true,
    disablePadding: false,
    label: "Send"
}, {
    id: "clientId",
    numeric: true,
    disablePadding: false,
    label: "Client"
}, {
    id: "traderId",
    numeric: true,
    disablePadding: false,
    label: "Trader"
}, {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    dateTime: true,
    label: "Date"
}, {
    id: "actions",
    numeric: true,
    disablePadding: false,
    label: "Actions"
}];

const VerifOfferTableHead = props => {
    const {
        onSelectAllRows,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        handleChangeFilter,
        offerFilter
    } = props;

    const {
        t
    } = useTranslation();
    
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    const [openMenuEl, setOpenMenuEl] = useState(null);
    const handleOpenMenu = event => {
        setOpenMenuEl(event.currentTarget);
    };
    const handleCloseOpenMenu = () => setOpenMenuEl(null);

    return <TableHead sx={{
        backgroundColor: theme => isDark(theme) ? "grey.700" : "grey.100"
    }}>
        <TableRow>
            <TableCell padding="checkbox">
                <Checkbox size="small" color="primary" onChange={onSelectAllRows} checked={rowCount > 0 && numSelected === rowCount} indeterminate={numSelected > 0 && numSelected < rowCount} />
            </TableCell>

            {headCells.map(headCell => <TableCell key={headCell.id} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false} sx={{
                color: "text.primary",
                fontWeight: 600
            }}>
                <FlexBox>
                <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : "asc"}>
                    {t(headCell.label)}
                    {orderBy === headCell.id ? <Span sx={visuallyHidden}>
                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Span> : null}
                </TableSortLabel>
                {headCell.filters && <TableMoreMenu key={headCell.id} open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
                        <FormGroup key={headCell.id} sx={{ paddingLeft: "15px", paddingRight: "10px" }}>
                        {headCell.filters.map(filter => <FormControlLabel key={filter.label} control={
                            <Checkbox key={filter.value} checked={offerFilter[headCell.id] && offerFilter[headCell.id].includes(filter.value)} size="small" color="primary" name={filter.label} onChange={() => {
                                //создаём новый объект фильтра
                                let newFilter = [filter.value];

                                // если старый фильтр существует и включает новый элемент убираем его
                                if (offerFilter[headCell.id] && offerFilter[headCell.id].includes(filter.value)) {
                                    newFilter = offerFilter[headCell.id].filter(item => item !== filter.value);
                                }
                                // если старый фильтр существует и не включает новый элемент добавляем его со старыми данными
                                else if (offerFilter[headCell.id]) {
                                    newFilter = [...offerFilter[headCell.id], filter.value];
                                }

                                // сбрасываем фильтр если массив пуст
                                if (newFilter.length === 0) {
                                    newFilter = null;
                                }

                                handleChangeFilter(headCell.id, newFilter);
                            }} />} label={t(filter.label)} />)}
                        </FormGroup>
                </TableMoreMenu>}
                </FlexBox>
            </TableCell>)}
        </TableRow>
    </TableHead>;
};
export default VerifOfferTableHead;