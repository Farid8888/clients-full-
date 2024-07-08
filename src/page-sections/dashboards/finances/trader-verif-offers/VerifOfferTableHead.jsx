import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
// CUSTOM COMPONENT
import { Span } from "components/typography";
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
    label: "Status"
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
    id: "verificationUrl",
    numeric: true,
    disablePadding: false,
    label: "Verification Url"
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
        onRequestSort
    } = props;

    const {
        t
    } = useTranslation();
    
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

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
                </FlexBox>
            </TableCell>)}
        </TableRow>
    </TableHead>;
};
export default VerifOfferTableHead;