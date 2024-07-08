import { useState, useEffect } from "react";
import { Box, Card, Table, TableBody, TableContainer, TablePagination, Modal } from "@mui/material";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { TableDataNotFound } from "components/table";
// CUSTOM PAGE SECTION COMPONENTS
import SearchArea from "./SearchArea";
import HeadingArea from "./HeadingArea";
import OfferHistorySumArea from "./OfferHistorySumArea";
import OfferHistoryTableRow from "./OfferHistoryTableRow";
import OfferHistoryTableHead from "./OfferHistoryTableHead";
// CUSTOM DEFINED HOOK
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";
// CUSTOM DUMMY DATA
//import { OFFER_LIST } from "__fakeData__/offers";
import useAuth from "hooks/useAuth";
import useOffers from "hooks/useOffers";
import { AddOfferVerificationPageView } from "../offers";
import { OfferVerificationProvider } from "contexts/OfferVerificationContext";

const OffersHistoryListPageView = () => {
    const styleModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        boxShadow: 24,
        padding: 0
    };

    const [firstFetch, setFirstFetch] = useState(true);
    const [isTrader, setIsTrader] = useState(false);
    const {
        offersList,
        updateOffers
    } = useOffers();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [offers, setOffers] = useState([]);
    const [offerFilter, setOfferFilter] = useState({
        offerType: "0",
        search: "",
        status: "",
        dateStart: 0,
        dateEnd: 0
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
            let dateFilter = true;
            let statusFilter = true;

            if (offerFilter.dateStart !== 0 && offerFilter.dateStart > item.createdAt) {
                dateFilter = false;
            }

            if (offerFilter.dateEnd !== 0 && offerFilter.dateEnd < item.createdAt) {
                dateFilter = false;
            }

            if (offerFilter.status !== "") {
                statusFilter = item.status === offerFilter.status;
            }

            if (item.type.toString() === offerFilter.offerType && offerFilter.search) {
                return statusFilter && dateFilter && (item.humanId.toString().toLowerCase().includes(offerFilter.search.toLowerCase()) || item.id.toString().toLowerCase().includes(offerFilter.search.toLowerCase()));
            } else if (item.type.toString() === offerFilter.offerType) {
                return statusFilter && dateFilter;
            } else {
                return false;
            }
        } else if (offerFilter.search) {
            return item.humanId.toString().toLowerCase().includes(offerFilter.search.toLowerCase()) || item.id.toString().toLowerCase().includes(offerFilter.search.toLowerCase());
        } else {
            return true;
        };
    });

    const {
        user,
        roleName
    } = useAuth();

    useEffect(() => {
        //определяем нужно ли отправлять клиент айди(чтобы смотреть только свои заявки)
        const isTrader = roleName && (roleName === "Owner" || roleName === "Trader");
        const userIds = user ? [user.id] : [];
        setIsTrader(isTrader);
        
        const params = {
            "orderIds": [],
            "clientIds": isTrader ? [] : userIds,
            "traderIds": isTrader ? userIds : [],
            "types": [
                0,
                1
            ],
            "statuses": [
                3,
                4,
                6,
                10,
                11,
                12,
                14
            ]
        };

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
            <Box px={2} pt={2} pb={0}>
                <HeadingArea value={offerFilter.offerType} changeTab={handleChangeTab} />

                <SearchArea filter={offerFilter} handleChangeFilter={handleChangeFilter} />
            </Box>

            <Box px={2}>
                <OfferHistorySumArea filteredOffers={filteredOffers} offerType={offerFilter.offerType} />
            </Box>

            {/* TABLE HEAD & BODY ROWS */}
            <TableContainer>
                <Scrollbar autoHide={false}>
                    <Table>
                        <OfferHistoryTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredOffers.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredOffers.map(row => row.id))} withMessage={offerFilter.offerType === "0" && !isTrader} />

                        <TableBody>
                            {filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(offer => <OfferHistoryTableRow key={offer.id} offer={offer} isSelected={isSelected(offer.id)} handleSelectRow={handleSelectRow} isTrader={isTrader} withMessage={offerFilter.offerType === "0" && !isTrader} openModal={handleOpen} />)}

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
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-verification"
            aria-describedby="modal-send-verification-file">
            <Box sx={styleModal}>
                <Card sx={{ pl: 3, pr: 3 }}>
                    <OfferVerificationProvider><AddOfferVerificationPageView /></OfferVerificationProvider>
                </Card>
            </Box>
        </Modal>
    </Box>;
};
export default OffersHistoryListPageView;