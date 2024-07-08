import { useState } from "react";
import { Box, Checkbox, Chip, TableCell, TableRow } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table";
import { useTranslation } from "react-i18next";

// ==============================================================

// ==============================================================

const GroupTableRow = props => {
  const {
    group,
    setGroupId,
    isSelected,
    handleDeleteGroup,
    handleSelectRow
  } = props;
  const navigate = useNavigate();
  const { 
    t
  } = useTranslation();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = event => {
    setOpenMenuEl(event.currentTarget);
  };
  const handleCloseOpenMenu = () => setOpenMenuEl(null);
  const handleEditGroup = () => {
    setGroupId(group.id);
    navigate("/dashboard/cards/group-edit");
  };

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, group.id)} />
      </TableCell>

      <TableCell padding="normal"><Paragraph fontSize={11}>{group.id}</Paragraph></TableCell>

      <TableCell padding="normal" onClick={handleEditGroup}>
        <FlexBox alignItems="center" gap={2}>
          <Box>
            <Paragraph fontWeight={500} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }}>
              {group.name}
            </Paragraph>
          </Box>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal">
        <Chip size="small" label={group.fiatGroupStatus} color={group.fiatGroupStatus === "ACTIVE" ? "success" : "secondary"} />
      </TableCell>

      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={Edit} title={t("Edit")} handleClick={() => {
          handleCloseOpenMenu();
          handleEditGroup();
        }} />
          <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
          handleCloseOpenMenu();
          handleDeleteGroup(group.id);
        }} />
        </TableMoreMenu>
      </TableCell>
    </TableRow>;
};
export default GroupTableRow;