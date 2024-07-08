import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "./SearchArea";
import VerifHeadingArea from "./VerifHeadingArea";
import VerifOfferTableRow from "./VerifOfferTableRow";
import VerifOfferTableHead from "./VerifOfferTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM DUMMY DATA
//import { OFFER_LIST } from "__fakeData__/offers";
import useAuth from "hooks/useAuth";
import useOffers from "hooks/useOffers";

const VerificationOffersList = () => {

    const [firstFetch, setFirstFetch] = useState(true);

    const {
        adminOffersListBuy,
        updateAdminVerifications
    } = useOffers();

    const [offers, setOffers] = useState([]);
    const [offerFilter, setOfferFilter] = useState({
        status: null,
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

    let filteredOffers = stableSort(offers, getComparator(order, orderBy)).filter(item => {
        if (offerFilter.status) {
            return offerFilter.status.includes(item.status);
        } else if (offerFilter.search) {
            return item.id.toLowerCase().includes(offerFilter.search.toLowerCase()) ||
                item.fiatInfos.cardNumber.toLowerCase().includes(offerFilter.search.toLowerCase()) ||
                item.clientId.toLowerCase().includes(offerFilter.search.toLowerCase()) ||
                item.clientName.toLowerCase().includes(offerFilter.search.toLowerCase()) ||
                item.traderId.toLowerCase().includes(offerFilter.search.toLowerCase()) ||
                item.traderName.toLowerCase().includes(offerFilter.search.toLowerCase());
        } else return true;
    });
    
    const {
        user,
        roleName
    } = useAuth();

    useEffect(() => {
        const params = {
            "offerIds": [],
            "clientIds": [],
            "traderIds": [],
            "offerTypes": [
               0
            ],
            "statuses": [
                8
            ]
        };

        if (firstFetch) {
            updateAdminVerifications(params);
            setFirstFetch(false);
        }
        
        const intervalId = setInterval(() => {
            updateAdminVerifications(params);
        }, 1000 * 5); // in milliseconds
        
        let offersList = adminOffersListBuy.filter(m => m.status === 8);

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

        return () => clearInterval(intervalId)
    }, [updateAdminVerifications, user, setOffers, adminOffersListBuy, roleName, firstFetch]);

    return <Box pt={2} pb={4}>
        <Card>
            <Box px={2} pt={2}>
                <VerifHeadingArea value={offerFilter.offerType} />

                <SearchArea value={offerFilter.search} onChange={e => handleChangeFilter("search", e.target.value)} />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
                <Scrollbar autoHide={false}>
                    <Table>
                        <VerifOfferTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredOffers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredOffers.map(row => row.id))} />

                        <TableBody>
                            {filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(offer => <VerifOfferTableRow key={offer.id} offer={offer} isSelected={isSelected(offer.id)} handleSelectRow={handleSelectRow} />)}

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
export default VerificationOffersList;