import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound, TableToolbar } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea";
import ManagerTableRow from "../ManagerTableRow";
import ManagerTableHead from "../ManagerTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
import useManagers from "hooks/useManagers";

// CUSTOM DUMMY DATA
const fake_managers = [{
    id: "ss-324dsf-dsgv-dfsvd",
    userName: "manager1",
    email: "manager1@email.ru",
    phone: "8-800-355-35-55",
    isBanned: false
}, {
    id: "dd-dferfg5436-dsgv-dfsvd",
    userName: "manager2",
    email: "manager2@email.ru",
    phone: "8-800-355-35-55",
    isBanned: true
}];

const ManagersListPageView = () => {
    const [users, setUsers] = useState([...fake_managers]);
    const [firstFetch, setFirstFetch] = useState(true);
    const [userFilter, setUserFilter] = useState({
        role: "",
        search: ""
    });

    const {
        managersList,
        updateManagersList,
        removeManager,
        setManager,
        resetManagerDatas
    } = useManagers();

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
        defaultOrderBy: "userName"
    });
    const handleChangeFilter = (key, value) => {
        setUserFilter(state => ({
            ...state,
            [key]: value
        }));
    };
    const handleChangeTab = (_, newValue) => {
        handleChangeFilter("role", newValue);
    };
    let filteredUsers = stableSort(users, getComparator(order, orderBy)).filter(item => {
        if (userFilter.search)
            return item.userName.toLowerCase().includes(userFilter.search.toLowerCase());
        else return true;
    });
    const handleDeleteUser = id => {
        removeManager([id], managersList);
    };
    const handleAllUserDelete = () => {
        removeManager(selected, managersList);
        handleSelectAllRows([])();
    };

    useEffect(() => {
        if (firstFetch) {
            resetManagerDatas();
            updateManagersList();
            setFirstFetch(false);
        }
        
        setUsers(managersList);
    }, [firstFetch, managersList, resetManagerDatas, updateManagersList]);

    return <Box pt={2} pb={4}>
        <Card>
            <Box px={2} pt={2}>
                <HeadingArea value={userFilter.role} changeTab={handleChangeTab} />

                <SearchArea value={userFilter.search} onChange={e => handleChangeFilter("search", e.target.value)} />
            </Box>

            {/* TABLE ROW SELECTION HEADER  */}
            {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllUserDelete} />}

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
                <Scrollbar autoHide={false}>
                    <Table>
                        <ManagerTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredUsers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredUsers.map(row => row.id))} />

                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => <ManagerTableRow key={user.id} user={user} isSelected={isSelected(user.id)} handleSelectRow={handleSelectRow} handleDeleteUser={handleDeleteUser} setManager={setManager} />)}

                            {filteredUsers.length === 0 && <TableDataNotFound />}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            {/* PAGINATION SECTION */}
            <Box padding={1}>
                <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredUsers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
            </Box>
        </Card>
    </Box>;
};
export default ManagersListPageView;