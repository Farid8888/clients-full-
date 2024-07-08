import { useState } from "react";
import { Box, Checkbox, Chip, TableCell, TableRow } from "@mui/material";
import { DeleteOutline, RemoveRedEye } from "@mui/icons-material";
import { format } from "date-fns";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import useCards from "hooks/useCards";

// ==============================================================

// ==============================================================

const CardTableRow = ({
    card,
    isSelected,
    handleSelectRow,
    handleDeleteCard
}) => {
    const navigate = useNavigate();
    const [openMenuEl, setOpenMenuEl] = useState(null);
    const handleOpenMenu = event => {
        setOpenMenuEl(event.currentTarget);
    };
    const handleCloseOpenMenu = () => setOpenMenuEl(null);

    const {
        setCardId,
    } = useCards();

    const handleEditCard = () => {
        setCardId(card.id);
        navigate("/dashboard/card-details");
    };

    return <TableRow hover>
        <TableCell padding="checkbox">
            <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, card.id)} />
        </TableCell>

        <TableCell padding="normal"><Paragraph fontSize={11}>{card.id}</Paragraph></TableCell>

        <TableCell padding="normal" onClick={() => { handleEditCard() }}>
            <FlexBox alignItems="center" gap={2}>
                <Paragraph fontWeight={500} color="text.primary" sx={{
                    ":hover": {
                        textDecoration: "underline",
                        cursor: "pointer"
                    }
                }}>
                    {card.cardNumber}
                </Paragraph>
            </FlexBox>
        </TableCell>

        <TableCell padding="normal">{card.providerCode}</TableCell>

        <TableCell padding="normal">{card.fiatCode}</TableCell>

        <TableCell padding="normal">{card.fiatCardGroupName}</TableCell>

        <TableCell padding="normal">{card.amountPerDay}</TableCell>

        <TableCell padding="normal">
            {card.fiatCardStatus && card.fiatCardStatus === "ACTIVE" ? <Chip label="Active" /> : <Chip label="Disabled" color="secondary" />}
        </TableCell>

        <TableCell padding="normal" align="left">
            <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
                <TableMoreMenuItem Icon={RemoveRedEye} title="View" handleClick={() => {
                    handleCloseOpenMenu();
                    handleEditCard();
                }} />
                <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
                    handleCloseOpenMenu();
                    handleDeleteCard(card.id);
                }} />
            </TableMoreMenu>
        </TableCell>
    </TableRow>;
};
export default CardTableRow;