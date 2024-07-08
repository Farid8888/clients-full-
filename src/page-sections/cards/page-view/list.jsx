import { useState, useEffect } from "react";
import { Tab, Box, Tabs, Card, Table, styled, Button, TableBody, TableContainer, TablePagination } from "@mui/material";
import Add from "icons/Add";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { FlexBetween } from "components/flexbox";
import { TableDataNotFound, TableToolbar } from "components/table";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM PAGE SECTION COMPONENTS
import CardTableRow from "../CardTableRow";
import CardTableHead from "../CardTableHead";
import CardTableActions from "../CardTableActions";

import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import useCards from "hooks/useCards";

//  STYLED COMPONENTS
const ListWrapper = styled(FlexBetween)(({
  theme
}) => ({
  gap: 16,
  [theme.breakpoints.down(440)]: {
    flexDirection: "column",
    ".MuiButton-root": {
      width: "100%"
    }
  }
}));
const CardListPageView = () => {
  const [firstFetch, setFirstFetch] = useState(true);
  const navigate = useNavigate();
  const {
    cardsList,
    updateCards,
    removeCard
  } = useCards();
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();

  const providerCodes = [];
  user && user.fiatPermissions.map(({
    code,
    name
  }) => {
    providerCodes.push({
        value: code,
        label: name,
    })
        
    return 0;
  });

  const [cards, setCards] = useState([...cardsList]);
  const [cardFilter, setCardFilter] = useState({
    providerCode: "",
  });

  const handleChangeFilter = (key, value) => {
    setCardFilter(state => ({
      ...state,
      [key]: value
    }));
  };
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
    defaultOrderBy: "createdAt",
    defaultOrder: "desc"
  });
  let filteredCards = cards && stableSort(cards, getComparator(order, orderBy)).filter(item => {
      if (cardFilter.providerCode === "" || cardFilter.providerCode === item.providerCode ) return true;
      else if (cardFilter.search) return item.cardNumber.toLowerCase().includes(cardFilter.search.toLowerCase());
      else return false;
  });
  const handleDeleteCard = id => {
    removeCard([id], user.id);
    setCards(state => state.filter(item => item.id !== id));
  };
  const handleAllCardsDelete = () => {
    removeCard(selected, user.id);
    setCards(state => state.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  };
  
  useEffect(() => {
    if (firstFetch) {
        updateCards();
        setFirstFetch(false);
    }

    const intervalId = setInterval(() => {
        updateCards();
    }, 1000 * 5); // in milliseconds

    setCards(cardsList);

    return () => clearInterval(intervalId)
  }, [user, updateCards, cardsList, firstFetch]);

  return filteredCards && <Box pt={2} pb={4}>
      <ListWrapper>
        <Tabs value={cardFilter.providerCode} onChange={(_, value) => handleChangeFilter("providerCode", value)}>
          <Tab disableRipple label={t("All Providers")} value="" />
          {providerCodes && providerCodes.map((option) => <Tab disableRipple key={option.value} label={option.label} value={option.value} />)}
        </Tabs>

        {/*<Button variant="contained" startIcon={<Add />} onClick={() => navigate("/dashboard/create-card")}>*/}
        {/*  {t("Add Card")}*/}
        {/*</Button>*/}
      </ListWrapper>

      <Card sx={{
      mt: 4
    }}>
        {/* SEARCH AND PUBLISH FILTER SECTION */}
        <CardTableActions filter={cardFilter} handleChangeFilter={handleChangeFilter} />

        {/* TABLE ROW SELECTION HEADER  */}
        {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllCardsDelete} />}

        {/* TABLE HEAD AND ROW SECTION */}
        <TableContainer>
          <Scrollbar>
            <Table sx={{
            minWidth: 820
          }}>
              <CardTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredCards.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredCards.map(row => row.id))} />

              <TableBody>
                {filteredCards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(card => <CardTableRow key={card.id} card={card} handleSelectRow={handleSelectRow} isSelected={isSelected(card.id)} handleDeleteCard={handleDeleteCard} />)}

                {filteredCards.length === 0 && <TableDataNotFound />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION SECTION */}
        <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredCards.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
      </Card>
    </Box>;
};
export default CardListPageView;