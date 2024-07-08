import { useState, useEffect } from "react";
import { Button, Card, Stack } from "@mui/material";
import { Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { H5 } from "components/typography";
import { Scrollbar } from "components/scrollbar";
import { FlexBetween } from "components/flexbox";
import { TableDataNotFound, TableToolbar } from "components/table";
import { IconWrapper } from "components/icon-wrapper";
import { useTranslation } from "react-i18next";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
import useNavigate from "hooks/useNavigate";
// CUSTOM ICON COMPONENTS
import Add from "icons/Add";
import Invoice from "icons/sidebar/Invoice";
// CUSTOM PAGE SECTION COMPONENTS
import GroupTableRow from "../GroupTableRow";
import GroupTableHead from "../GroupTableHead";
import GroupTableActions from "../GroupTableActions";
// CUSTOM DUMMY DATA
import useGroupsCards from "hooks/useGroupsCards";
import { red } from "@mui/material/colors";

const CardsGroupsListPageView = () => {
    const [firstFetch, setFirstFetch] = useState(true);
    const {
        cardsGroups,
        updateCardsGroups,
        setGroupId,
        removeCardGroup
    } = useGroupsCards();
    let navigate = useNavigate();
    const {
        t
    } = useTranslation();
    const [groups, setGroups] = useState(cardsGroups);
    const [groupFilter, setGroupFilter] = useState({
        search: "",
        status: ""
    });
    const handleChangeFilter = (key, value) => {
        setGroupFilter(state => ({
            ...state,
            [key]: value
        }));
    };
    const {
        page,
        order,
        orderBy,
        selected,
        rowsPerPage,
        isSelected,
        handleSelectRow,
        handleChangePage,
        handleRequestSort,
        handleSelectAllRows,
        handleChangeRowsPerPage
    } = useMuiTable({
        defaultOrderBy: "name"
    });
    let filteredGroups = stableSort(groups, getComparator(order, orderBy)).filter(item => {
        if (groupFilter.status === 0) return item.fiatGroupStatus === "ACTIVE"; else if (groupFilter.status === 1) return item.fiatGroupStatus === "PAUSE";
        return item.name.toLowerCase().includes(groupFilter.search.toLowerCase());
    });

    const handleDeleteGroup = id => {
        removeCardGroup(id);
    };
    //const handleAllDeleteInvoice = () => {
    //    setGroups(state => state.filter(item => !selected.includes(item.id)));
    //    handleSelectAllRows([])();
    //};

    useEffect(() => {
        if (firstFetch) {
            updateCardsGroups();
            setFirstFetch(false);
        }

        const intervalId = setInterval(() => {
            updateCardsGroups();
        }, 1000 * 5); // in milliseconds

        setGroups(cardsGroups);

        return () => clearInterval(intervalId)
    }, [cardsGroups, firstFetch, groups, updateCardsGroups]);

    return <Card>
        <FlexBetween flexWrap="wrap" gap={2} p={2} pt={2.5}>
            <Stack direction="row" alignItems="center">
                <IconWrapper>
                    <Invoice color="primary" />
                </IconWrapper>

                <H5 fontSize={16}>{t("Groups List")}</H5>
                <H5 fontSize={14} ml={1} style={{ color: '#B22222' }}>{t("When you delete a group, the cards associated with this group are also deleted.")}</H5>
            </Stack>

            <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/cards/create-group")}>
                {t("Add New Card Group")}
            </Button>
        </FlexBetween>

        {/* GROUP FILTER ACTION BAR */}
        <GroupTableActions filter={groupFilter} handleChangeFilter={handleChangeFilter} />

        {/* TABLE ROW SELECTION HEADER  */}
        {/*{selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllDeleteInvoice} />}*/}

        {/* TABLE HEAD & BODY ROWS */}
        <TableContainer>
            <Scrollbar autoHide={false}>
                <Table sx={{
                    minWidth: 900
                }}>
                    {/* TABLE HEAD SECTION */}
                    <GroupTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredGroups.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredGroups.map(row => row.id))} />

                    {/* TABLE BODY & DATA SECTION */}
                    <TableBody>
                        {filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(group => <GroupTableRow key={group.id} group={group} handleSelectRow={handleSelectRow} setGroupId={setGroupId} isSelected={isSelected(group.id)} handleDeleteGroup={handleDeleteGroup} />)}

                        {filteredGroups.length === 0 && <TableDataNotFound />}
                    </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>

        {/* TABLE PAGINATION SECTION */}
        <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredGroups.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
    </Card>;
};
export default CardsGroupsListPageView;