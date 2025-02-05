import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
// CUSTOM COMPONENT
import { Span } from "components/typography";
import { useTranslation } from "react-i18next";
// CUSTOM UTILS METHOD
import { isDark } from "utils/constants";


// TABLE HEAD COLUMN DATA
const headCells = [{
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "Id"
}, {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name"
}, {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status"
}, {
    id: "",
    numeric: true,
    disablePadding: false,
    label: "Actions"
}];

const GroupTableHead = props => {
  const {
    order,
    orderBy,
    onRequestSort,
    rowCount,
    numSelected,
    onSelectAllRows
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
export default GroupTableHead;