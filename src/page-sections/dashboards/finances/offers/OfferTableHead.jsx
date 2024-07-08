import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
// CUSTOM COMPONENT
import { Span } from "components/typography";
// CUSTOM UTILS METHOD
import { isDark } from "utils/constants";
import { useTranslation } from "react-i18next";

// ==============================================================

// ==============================================================

const OfferTableHead = props => {
    const {
        onSelectAllRows,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        withMessage
    } = props;

    const {
        t
    } = useTranslation();


    const headCells = [{
        id: "id",
        numeric: false,
        disablePadding: false,
        label: t("Id / Human Id")
    }, {
        id: "status",
        numeric: true,
        disablePadding: false,
        label: t("Status")
    }, {
        id: "fiatInfos.cardNumber",
        numeric: true,
        disablePadding: false,
        label: t("Requisites")
    }, {
        id: "amountSend",
        numeric: true,
        disablePadding: false,
        label: t("Send")
    }, {
        id: "amountTake",
        numeric: true,
        disablePadding: false,
        label: t("Receive")
    }, {
        id: "price",
        numeric: true,
        disablePadding: false,
        label: t("Price")
    }, {
        id: "createdAt",
        numeric: false,
        disablePadding: false,
        dateTime: true,
        label: t("Date")
    }];

    withMessage && headCells.push({
        id: "message",
        numeric: false,
        disablePadding: false,
        label: t("Message")
    });

    headCells.push({
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: t("Actions")
    });

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
                <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : "asc"}>
                    {headCell.label}
                    {orderBy === headCell.id ? <Span sx={visuallyHidden}>
                        {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Span> : null}
                </TableSortLabel>
            </TableCell>)}
        </TableRow>
    </TableHead>;
};
export default OfferTableHead;