import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import HeadingArea from "./HeadingArea";
import CommissionsTableRow from "./CommissionsTableRow";
import CommissionsTableHead from "./CommissionsTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
import useCommissions from "hooks/useCommissions";

const CommissionsList1PageView = () => {
  const [comissions, setComissions] = useState([]);
  
  const [firstFetch, setFirstFetch] = useState(true);
  const {
    customCommissionsList,
    updateCustomCommissions,
    editCustomCommission,
    deleteCustomCommission
  } = useCommissions();
  
  const [commissionsFilter, setCommissionsFilter] = useState({
    providerCode: "",
    search: ""
  });
  const {
    page,
    order,
    orderBy,
    selected,
    isSelected,
    rowsPerPage,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: "name"
  });
  const handleChangeFilter = (key, value) => {
    setCommissionsFilter(state => ({
      ...state,
      [key]: value
    }));
  };
  const handleChangeTab = (_, newValue) => {
    handleChangeFilter("providerCode", newValue);
  };
  let filteredCommissions = stableSort(comissions, getComparator(order, orderBy)).filter(item => {
    if (commissionsFilter.providerCode) return item.providerCode.toLowerCase() === commissionsFilter.providerCode;else if (commissionsFilter.search) return item.name.toLowerCase().includes(commissionsFilter.search.toLowerCase());else return true;
  });
  
  const handleEditCommission = (values) => {
      editCustomCommission(values);
  };

  const handleDeleteCommission = (id) => {
      deleteCustomCommission(id);
  };
 
  //только уникальные строчки провайдеров
  function unique(arr) {
    let result = [];

    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }

    return result;
  }
  const providerCodes = unique(comissions.map((com) => com.providerCode));
  
  useEffect(() => {
    if (firstFetch) {
        updateCustomCommissions();
        setFirstFetch(false);
    }
    
    const intervalId = setInterval(() => {
        updateCustomCommissions();
    }, 1000 * 3); // in milliseconds
    
    setComissions(customCommissionsList);
    return () => clearInterval(intervalId)
  }, [customCommissionsList, firstFetch, updateCustomCommissions]);

  return <Box pt={2} pb={4}>
      <Card>
        <Box px={2} pt={2}>
          <HeadingArea value={commissionsFilter.providerCode} changeTab={handleChangeTab} providerCodes={providerCodes} />
        </Box>
        
        {/* TABLE HEAD & BODY ROWS */}
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <CommissionsTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredCommissions.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredCommissions.map(row => row.id))} />

              <TableBody>
                {filteredCommissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(commission => <CommissionsTableRow key={commission.id} commission={commission} isSelected={isSelected(commission.id)} handleSelectRow={handleSelectRow} handleEditCommission={handleEditCommission} handleDeleteCommission={handleDeleteCommission} />)}

                {filteredCommissions.length === 0 && <TableDataNotFound />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION SECTION */}
        <Box padding={1}>
          <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredCommissions.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
        </Box>
      </Card>
    </Box>;
};

export default CommissionsList1PageView;