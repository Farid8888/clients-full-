import { useState } from "react";
import { TextField, Box, Checkbox, TableCell, TableRow, MenuItem } from "@mui/material";
import { Edit, Check } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem } from "components/table";
import { useFormik } from "formik";
import useNavigate from "hooks/useNavigate";
import * as Yup from "yup";
// CUSTOM DEFINED HOOKS
import useApp from "hooks/useApp";

// ==============================================================

// ==============================================================

const UserTableRow = props => {
  const {
    user,
    isSelected,
    handleSelectRow,
    handleEditClient
  } = props;

  const [onEdit, setOnEdit] = useState(false);
  const navigate = useNavigate();
  const { 
    setUserData
  } = useApp();

  const handleOnEdit = () => setOnEdit(!onEdit);
  const handleSave = () => {
    handleSubmit();
  }

  const initialValues = {
    userId: user.userId,
    balance: user.balance,
    status: (user.isBanned ? "Banned" : "Active")
  };
  
  const validationSchema = Yup.object({
    percent: Yup.number(),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
        values.isBanned = values.status !== "Active";
        handleEditClient(values);
        setOnEdit(!onEdit);
    }
  });

  const statusTypes = [
      {
          value: "Active",
          label: "Active"
      },
      {
          value: "Banned",
          label: "Banned"
      }
  ]

  return <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, user.id)} />
      </TableCell>

      <TableCell padding="normal">{user.id}</TableCell>
      
      <TableCell padding="normal">
        <FlexBox alignItems="center" gap={2}>
          <Box>
            <Paragraph fontWeight={500} color="text.primary" sx={{
            ":hover": {
              textDecoration: "underline",
              cursor: "pointer"
            }
          }} onClick={() => { setUserData(user); navigate("/dashboard/admin/edit-user?role=Client"); }}>
              {user.userName}
            </Paragraph>
          </Box>
        </FlexBox>
      </TableCell>

      <TableCell padding="normal">{user.email}</TableCell>

      <TableCell padding="normal">
          <FlexBox alignItems="center">
              {!onEdit ? parseFloat(values.balance).toFixed(3) : <TextField
                      fullWidth
                      name="balance"
                      value={parseFloat(values.balance).toFixed(3)}
                      onChange={handleChange}
                      disabled={!onEdit}
                      helperText={touched.balance && errors.balance}
                      error={Boolean(touched.balance && errors.balance)} />}
              {!onEdit && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                  handleOnEdit();
              }} />}
              {onEdit && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                  handleSave();
              }} />}
          </FlexBox>
      </TableCell>

      <TableCell padding="normal">{parseFloat(user.balanceLimit).toFixed(3)}</TableCell>

      <TableCell padding="normal">
          <FlexBox alignItems="center">
              {!onEdit ? values.status : <TextField
                  fullWidth
                  select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  disabled={!onEdit}
                  helperText={touched.status && errors.status}
                  error={Boolean(touched.status && errors.status)}>
                  {statusTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </TextField>}
              {!onEdit && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                  handleOnEdit();
              }} />}
              {onEdit && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                  handleSave();
              }} />}
          </FlexBox>
      </TableCell>
    </TableRow>;
};
export default UserTableRow;