import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "./offers/SearchArea";
import HeadingArea from "./offers/HeadingArea";
import TraderOfferTableRow from "./offers/TraderOfferTableRow";
import OfferTableHead from "./offers/OfferTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM DUMMY DATA
//import { OFFER_LIST } from "__fakeData__/offers";
import useAuth from "hooks/useAuth";
import useOffers from "hooks/useOffers";

const TraderOfferList1PageView = () => {
  const [firstFetch, setFirstFetch] = useState(true);
  const {
    traderOffersList,
    updateTraderOffers
  } = useOffers();

  const [offers, setOffers] = useState([]);
  const [offerFilter, setOfferFilter] = useState({
    offerType: "0",
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
    defaultOrderBy: "createdAt",
    defaultOrder: "desc"
  });
  const handleChangeFilter = (key, value) => {
    setOfferFilter(state => ({
      ...state,
      [key]: value
    }));
  };
  const handleChangeTab = (_, newValue) => {
    handleChangeFilter("offerType", newValue);
  };

  let filteredOffers = stableSort(offers, getComparator(order, orderBy)).filter(item => {
    if (offerFilter.offerType) {
        if (item.type.toString() === offerFilter.offerType && offerFilter.search) {
            return item.humanId.toString().toLowerCase().includes() || item.id.toString().toLowerCase().includes(offerFilter.search.toLowerCase());
        } else if (item.type.toString() === offerFilter.offerType) {
            return true;
        } else {
            return false;
        }
    } else if (offerFilter.search) {
        return item.humanId.toString().toLowerCase().includes(offerFilter.search.toLowerCase()) || item.id.toString().toLowerCase().includes(offerFilter.search.toLowerCase());
    } else return true;
  });

  const {
    user
  } = useAuth();
  
  useEffect(() => {
    //определяем нужно ли отправлять клиент айди(чтобы смотреть только свои заявки)
    const traderIds = user ? [user.id] : [];

    const params = {
      "orderIds": [],
      "clientIds": [],
      "traderIds": traderIds,
      "types": [
        0,
      ],
      "statuses": [
        1,
        2,
        5,
        7,
        9,
        11,
        12,
        13
      ]
    };

    if (firstFetch) {
      updateTraderOffers(params);
      setFirstFetch(false);
    }

    async function fetchOffers() {
      await updateTraderOffers(params);
    };

    const intervalId = setInterval(() => {
      fetchOffers()
    }, 1000 * 3); // in milliseconds

    // Маппим суммы для сортировки
    setOffers(traderOffersList.map(offer => {
      var amountSend = offer.type === 0 ? offer.amountToken : offer.amountFiat;
      var amountTake = offer.type === 0 ? offer.amountFiat : offer.amountToken;

      offer = {
        ...offer,
        amountSend: amountSend,
        amountTake: amountTake
      };

      return offer;
    }));

    return () => clearInterval(intervalId)
  }, [updateTraderOffers, user, setOffers, traderOffersList, firstFetch]);
  
  return <Box pt={2} pb={4}>
      <Card>
        <Box px={2} pt={2}>
              <HeadingArea value={offerFilter.offerType} changeTab={handleChangeTab} isTrader={true} isPersonal={true} />

              <SearchArea value={offerFilter.search} onChange={e => handleChangeFilter("search", e.target.value)} />
        </Box>

        {/* TABLE HEAD & BODY ROWS */}
        <TableContainer>
          <Scrollbar autoHide={false}>
            <Table>
              <OfferTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredOffers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredOffers.map(row => row.id))} withMessage={false}/>

              <TableBody>
                {filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(offer => <TraderOfferTableRow key={offer.id} offer={offer} isSelected={isSelected(offer.id)} handleSelectRow={handleSelectRow} isTrader={true} withMessage={false} />)}

                {filteredOffers.length === 0 && <TableDataNotFound />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        {/* PAGINATION SECTION */}
        <Box padding={1}>
          <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredOffers.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
        </Box>
      </Card>
    </Box>;
};
export default TraderOfferList1PageView;