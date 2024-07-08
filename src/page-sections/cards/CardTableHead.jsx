import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
// CUSTOM COMPONENT
import { Span } from "components/typography";
// CUSTOM UTILS METHOD
import { isDark } from "utils/constants";
import { useTranslation } from "react-i18next";

// ==============================================================

// ==============================================================
const CardTableHead = props => {
    const {
        onSelectAllRows,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort
    } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const {
        t
    } = useTranslation();

    const headCells = [{
        id: "id",
        numeric: false,
        disablePadding: false,
        label: "Id"
    }, {
        id: "cardNumber",
        numeric: false,
        disablePadding: false,
        label: t("card cardNumber")
    }, {
        id: "providerCode",
        numeric: false,
        disablePadding: false,
        label: t("card providerCode")
    }, {
        id: "fiatCode",
        numeric: false,
        disablePadding: false,
        label: t("card fiatCode")
    }, {
        id: "cardGroup",
        numeric: false,
        disablePadding: false,
        label: t("card cardGroup")
    }, {
        id: "amountPerDay",
        numeric: true,
        disablePadding: false,
        label: t("card amountPerDay")
    }, {
        id: "fiatCardStatus",
        numeric: false,
        disablePadding: false,
        label: t("card fiatCardStatus")
    }, {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: t("Actions")
    }];

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
export default CardTableHead;