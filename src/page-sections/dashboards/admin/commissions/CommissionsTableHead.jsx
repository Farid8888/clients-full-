import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
// CUSTOM COMPONENT
import { Span } from "components/typography";
// CUSTOM UTILS METHOD
import { isDark } from "utils/constants";
import { useTranslation } from "react-i18next";

const headCells = [{
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Id"
}, {
    id: "offerType",
    numeric: false,
    disablePadding: false,
    label: "Offer Type"
}, {
    id: "percentClient",
    numeric: true,
    disablePadding: false,
    label: "Percent Client"
}, {
    id: "percentOur",
    numeric: true,
    disablePadding: false,
    label: "Percent Our"
}, {
    id: "percentTrader",
    numeric: true,
    disablePadding: false,
    label: "Percent Trader"
}, {
    id: "providerCode",
    numeric: true,
    disablePadding: false,
    label: "Provider Code"
}, {
    id: "tokencode",
    numeric: true,
    disablePadding: false,
    label: "Token Code"
}, {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions"
}];

const CommissionsTableHead = props => {
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
              {t(headCell.label)}
              {orderBy === headCell.id ? <Span sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Span> : null}
            </TableSortLabel>
          </TableCell>)}
      </TableRow>
    </TableHead>;
};
export default CommissionsTableHead;