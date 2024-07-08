import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "./offers/SearchArea";
import HeadingArea from "./offers/HeadingArea";
import OfferTableRow from "./offers/OfferTableRow";
import OfferTableHead from "./offers/OfferTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM DUMMY DATA
//import { OFFER_LIST } from "__fakeData__/offers";
import useAuth from "hooks/useAuth";
import useOffers from "hooks/useOffers";

const OfferList1PageView = () => {
  const [firstFetch, setFirstFetch] = useState(true);
  const [isTrader, setIsTrader] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const {
    offersList,
    updateOffers
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
            return item.humanId.toString().toLowerCase().includes(offerFilter.search.toLowerCase()) || item.id.toString().toLowerCase().includes(offerFilter.search.toLowerCase());
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
        user,
        roleName
    } = useAuth();

    useEffect(() => {
        const isManager = roleName && roleName === "Manager";
        //определяем нужно ли отправлять клиент айди(чтобы смотреть только свои заявки)
        const isTrader = roleName && (roleName === "Owner" || roleName === "Trader");
        const clientIds = user ? (isTrader ? [] : [user.id]) : [];
        setIsTrader(isTrader);
        setIsManager(isManager);
        
        const params = {
            "orderIds": [],
            "clientIds": clientIds,
            "traderIds": [],
            "types": [
                0,
                1
            ],
            "statuses": [
                0,
                1
            ]
        };

        if (!isTrader) {
            params.statuses = [0, 1, 2, 5, 7, 8, 9, 13];
        }

        if (firstFetch) {
            updateOffers(params);
            setFirstFetch(false);
        }
        
        const intervalId = setInterval(() => {
            updateOffers(params);
        }, 1000 * 1); // in milliseconds

        // Маппим суммы для сортировки
        setOffers(offersList.map(offer => {
            var amountSend = offer.type === 0 ? offer.amountToken : offer.amountFiat;
            var amountTake = offer.type === 0 ? offer.amountFiat : offer.amountToken;

            offer = {
                ...offer,
                amountSend: amountSend,
                amountTake: amountTake
            };

            return offer;
        }));

        return () => clearInterval(intervalId);
    }, [updateOffers, user, offersList, roleName, firstFetch, offerFilter.offerType]);
    
    return <Box pt={2} pb={4}>
      <Card>
        <Box px={2} pt={2}>
              <HeadingArea value={offerFilter.offerType} changeTab={handleChangeTab} isTrader={isTrader} isManager={isManager} isPersonal={!isTrader}/>
              
              <SearchArea value={offerFilter.search} onChange={e => handleChangeFilter("search", e.target.value)} />
        </Box>
        
        {/* TABLE HEAD & BODY ROWS */}
        <TableContainer>
          <Scrollbar autoHide={false}>
              <Table>
                <OfferTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredOffers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredOffers.map(row => row.id))} withMessage={offerFilter.offerType === "0" && !isTrader} />

              <TableBody>
                {filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(offer => <OfferTableRow key={offer.id} offer={offer} isSelected={isSelected(offer.id)} handleSelectRow={handleSelectRow} isTrader={isTrader} withMessage={offerFilter.offerType === "0" && !isTrader} />)}

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
export default OfferList1PageView;