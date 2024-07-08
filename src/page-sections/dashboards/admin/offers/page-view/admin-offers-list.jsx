import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "../SearchArea";
import HeadingArea from "../HeadingArea";
import OfferTableRow from "../OfferTableRow";
import OfferTableHead from "../OfferTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM DUMMY DATA
//import { OFFER_LIST } from "__fakeData__/offers";
import useAuth from "hooks/useAuth";
import useOffers from "hooks/useOffers";

const AdminOffersListPageView = ({ offerType }) => {

    const [firstFetch, setFirstFetch] = useState(true);

    const {
        adminOffersListBuy,
        adminOffersListSell,
        updateAdminOffers
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
                item.humanId.toString().toLowerCase().includes(offerFilter.search.toLowerCase()) ||
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
               offerType
            ],
            "statuses": [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                10,
                11,
                12,
                13,
                14
            ]
        };

        if (firstFetch) {
            updateAdminOffers(params);
            setFirstFetch(false);
        }

        const intervalId = setInterval(() => {
            updateAdminOffers(params);
        }, 1000 * 1); // in milliseconds
        
        let offersList = offerType === 0 ? adminOffersListBuy : adminOffersListSell;

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
    }, [updateAdminOffers, user, setOffers, adminOffersListBuy, adminOffersListSell, roleName, firstFetch, offerType]);

    return <Box pt={2} pb={4}>
        <Card>
            <Box px={2} pt={2}>
                <HeadingArea value={offerFilter.offerType} offerType={offerType} />

                <SearchArea value={offerFilter.search} onChange={e => handleChangeFilter("search", e.target.value)} />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
                <Scrollbar autoHide={false}>
                    <Table>
                        <OfferTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredOffers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredOffers.map(row => row.id))} handleChangeFilter={handleChangeFilter} offerFilter={offerFilter} />

                        <TableBody>
                            {filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(offer => <OfferTableRow key={offer.id} offer={offer} isSelected={isSelected(offer.id)} handleSelectRow={handleSelectRow} />)}

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
export default AdminOffersListPageView;