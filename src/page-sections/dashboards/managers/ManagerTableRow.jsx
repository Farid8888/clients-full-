import { useState } from "react";
import { Box, Checkbox, TableCell, TableRow, Chip } from "@mui/material";
import { DeleteOutline, Edit } from "@mui/icons-material";
// CUSTOM DEFINED HOOK
import useNavigate from "hooks/useNavigate";
import { useTranslation } from "react-i18next";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table";

// ==============================================================

// ==============================================================

const ManagerTableRow = props => {
  const {
    user,
    isSelected,
    handleSelectRow,
    handleDeleteUser,
    setManager
  } = props;
  const navigate = useNavigate();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = event => {
    setOpenMenuEl(event.currentTarget);
  };
  const handleCloseOpenMenu = () => setOpenMenuEl(null);
  const {
    t
  } = useTranslation();

  const editManager = () => {
    setManager(user);
    navigate("/dashboard/managers/edit");
  }

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, user.id)} />
      </TableCell>

      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
            <Paragraph fontSize={13}>{user.id}</Paragraph>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal" onClick={() => { editManager() }}>
        <FlexBox alignItems="center" gap={2}>
          <Box>
            <Paragraph fontWeight={500} color="text.primary" sx={{
              ":hover": {
                textDecoration: "underline",
                cursor: "pointer"
              }
            }} onClick={editManager}>
              {user.userName}
            </Paragraph>
          </Box>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal">{user.email}</TableCell>

      <TableCell padding="normal">{user.isBanned}
          <Chip size="small" label={user.isBanned ? "INACTIVE" : "ACTIVE"} color={user.isBanned ? "secondary" : "success"} />
      </TableCell>
      
      <TableCell padding="normal">
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
          <TableMoreMenuItem Icon={Edit} title={t("Edit")} handleClick={() => {
          handleCloseOpenMenu();
          editManager();
        }} />
          <TableMoreMenuItem Icon={DeleteOutline} title={t("Delete")} handleClick={() => {
          handleCloseOpenMenu();
          handleDeleteUser(user.id);
        }} />
        </TableMoreMenu>
      </TableCell>
    </TableRow>;
};
export default ManagerTableRow;