import { useState, useEffect } from "react";
import { Box, Card, Table, TableRow, TableBody, TableHead, TableCell, TableSortLabel } from "@mui/material";
import { nanoid } from "nanoid";
// CUSTOM COMPONENTS
import { Scrollbar } from "components/scrollbar";
import { StatusBadge } from "components/status-badge";
import { Paragraph, Span } from "components/typography";
import { FlexBetween } from "components/flexbox";
import { numberFormat } from "utils/numberFormat";
import { visuallyHidden } from "@mui/utils";
// COMMON DASHBOARD RELATED COMPONENTS
import { BodyTableCell, HeadTableCell } from "../dashboards/_common";

// CUSTOM DEFINED HOOK
import useAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import useCards from "hooks/useCards";
import useMuiTable, { getComparator, stableSort } from "hooks/useMuiTable";

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const CardHistory = () => {
    const [firstFetch, setFirstFetch] = useState(true);
    const [history, setHistory] = useState([]);
    const {
        cardHistory,
        cardId,
        updateCardHistory
    } = useCards();
    const {
        t
    } = useTranslation();
    const {
        user
    } = useAuth();

    const operationType = {
        DEPOSIT: 0,
        DEPOSIT_HOLD: 1
    };

    const operationTypeDesign = {
        success: 0,//DEPOSIT
        warning: 1//DEPOSIT_HOLD
    };

    useEffect(() => {
        if (firstFetch) {
            updateCardHistory({ traderId: user.id, fiatCardId: cardId });
            setFirstFetch(false);
        }

        const intervalId = setInterval(() => {
            updateCardHistory({ traderId: user.id, fiatCardId: cardId });
        }, 1000 * 5); // in milliseconds

        setHistory(cardHistory);

        return () => clearInterval(intervalId)
    }, [user, cardId, updateCardHistory, cardHistory, firstFetch]);

    const createSortHandler = property => event => {
        handleRequestSort(event, property);
    };

    const {
        order,
        orderBy,
        handleRequestSort
    } = useMuiTable({
        defaultOrderBy: "updatedAt",
        defaultOrder: "desc"
    });

    const headCells = [{
        id: "id",
        numeric: false,
        disablePadding: false,
        label: t("card id")
    }, {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: t("card amount")
    }, {
        id: "updatedAt",
        numeric: true,
        disablePadding: false,
        label: t("card date")
    }, {
        id: "operationType",
        numeric: true,
        disablePadding: false,
        label: t("card status")
    }];

    let sortedHistory = history && stableSort(history, getComparator(order, orderBy));

    return sortedHistory && <Card sx={{
        height: "100%"
    }}>
        <FlexBetween p={3}>
            <Box>
                <Paragraph lineHeight={1} fontSize={18} fontWeight={500}>
                    {t("card Transactions History")}
                </Paragraph>
            </Box>
        </FlexBetween>

        <Scrollbar>
            <Table sx={{ 
                minWidth: 600,
                mt: 1
            }}>
                <TableHead>
                    {headCells.map(headCell => <TableCell key={headCell.id} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false} sx={{
                        color: "text.primary",
                        fontWeight: 600
                    }}>
                        <TableSortLabel active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : "asc"}>
                            {headCell.label}
                            {orderBy === headCell.id ? <Span sx={visuallyHidden}>
                                {order === "desc" ? "sorted descending" : "sorted ascending"}
                            </Span> : null}
                        </TableSortLabel>
                    </TableCell>)}
                </TableHead>

                <TableBody>
                    {sortedHistory.map((item, index) => <TableRow key={index}>
                        <BodyTableCell>
                            <Box>
                                <Paragraph color="text.primary" fontWeight={500}>
                                    {item.id}
                                </Paragraph>
                            </Box>
                        </BodyTableCell>

                        <BodyTableCell>
                            <Paragraph fontWeight={500} color="text.primary">
                                {numberFormat(item.amount)}
                            </Paragraph>
                        </BodyTableCell>

                        <BodyTableCell align="center">{new Date(item.updatedAt * 1000).toLocaleString()}</BodyTableCell>

                        <BodyTableCell align="center">
                            <StatusBadge type={getEnumKeyByEnumValue(operationTypeDesign, item.operationType)}>
                                {getEnumKeyByEnumValue(operationType, item.operationType)}
                            </StatusBadge>
                        </BodyTableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </Scrollbar>
    </Card>;
};
export default CardHistory;