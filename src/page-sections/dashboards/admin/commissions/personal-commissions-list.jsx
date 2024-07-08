import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import PersonalHeadingArea from "./PersonalHeadingArea";
import PersonalCommissionsTableRow from "./PersonalCommissionsTableRow";
import PersonalCommissionsTableHead from "./PersonalCommissionsTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM DUMMY DATA
import useCommissions from "hooks/useCommissions";

const PersonalCommissionsList1PageView = (props) => {
    const {
        isTraders
    } = props;

    const [personalComissions, setPersonalComissions] = useState([]);

    const [firstFetch, setFirstFetch] = useState(true);
    const {
        personalCommissionsList,
        updatePersonalCommissions,
        editPersonalCommission,
        deletePersonalCommission
    } = useCommissions();
    
    const [personalCommissionsFilter, setPersonalCommissionsFilter] = useState({
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
        setPersonalCommissionsFilter(state => ({
            ...state,
            [key]: value
        }));
    };
    const handleChangeTab = (_, newValue) => {
        handleChangeFilter("providerCode", newValue);
    };
    let filteredCommissions = stableSort(personalComissions, getComparator(order, orderBy)).filter(item => {
        if (personalCommissionsFilter.providerCode) return item.providerCode.toLowerCase() === personalCommissionsFilter.providerCode; else if (personalCommissionsFilter.search) return item.name.toLowerCase().includes(personalCommissionsFilter.search.toLowerCase()); else return true;
    });
    
    const handleEditPersonalCommission = (values) => {
        editPersonalCommission(values);
    };

    const handleDeletePersonalCommission = (values) => {
        deletePersonalCommission(values);
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
    const providerCodes = unique(personalComissions.map((com) => com.providerCode));
    
    useEffect(() => {
        if (firstFetch) {
            updatePersonalCommissions(isTraders);
            setFirstFetch(false);
        }

        const intervalId = setInterval(() => {
            updatePersonalCommissions(isTraders);
        }, 1000 * 3); // in milliseconds

        setPersonalComissions(personalCommissionsList);
        return () => clearInterval(intervalId)
    }, [personalCommissionsList, firstFetch, updatePersonalCommissions, isTraders]);

    return <Box pt={2} pb={4}>
        <Card>
            <Box px={2} pt={2}>
                <PersonalHeadingArea value={personalCommissionsFilter.providerCode} changeTab={handleChangeTab} providerCodes={providerCodes} isTraders={isTraders} />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
                <Scrollbar autoHide={false}>
                    <Table>
                        <PersonalCommissionsTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredCommissions.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredCommissions.map(row => row.id))} />

                        <TableBody>
                            {filteredCommissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(commission => <PersonalCommissionsTableRow key={commission.id} commission={commission} isSelected={isSelected(commission.id)} handleSelectRow={handleSelectRow} handleEditPersonalCommission={handleEditPersonalCommission} handleDeletePersonalCommission={handleDeletePersonalCommission} />)}

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

export default PersonalCommissionsList1PageView;