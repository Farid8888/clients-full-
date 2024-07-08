import { useState } from "react";
import { TextField, Checkbox, TableCell, TableRow } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { Edit, Check } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem, TableMoreMenu } from "components/table";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const CommissionsTableRow = props => {
  const {
    commission,
    isSelected,
    handleSelectRow,
    handleEditCommission,
    handleDeleteCommission
  } = props;

  const [onEdit, setOnEdit] = useState(false);
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = event => {
        setOpenMenuEl(event.currentTarget);
  };
  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  const handleOnEdit = () => setOnEdit(!onEdit);
  const handleSave = () => {
    handleSubmit();
  }
  
  const validationSchema = Yup.object({
    percentClient: Yup.number(),
    percentOur: Yup.number(),
  });
  const initialValues = {
    id: commission.id,
    offerType: commission.offerType,
    percentClient: commission.percentClient,
    percentOur: commission.percentOur,
    providerCode: commission.providerCode,
    tokenCode: commission.tokenCode,
  };
  
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
        handleEditCommission(values);
        setOnEdit(!onEdit);
    }
  });

  const offerType = {
    BUY: 0,
    SELL: 1,
  };
  
  const {
    t
  } = useTranslation();

  return <TableRow hover>
          <TableCell padding="checkbox">
            <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, commission.id)} />
          </TableCell>

          <TableCell padding="normal"><Paragraph fontSize={11}>{commission.id}</Paragraph></TableCell>
          
          <TableCell padding="normal">{getEnumKeyByEnumValue(offerType, commission.offerType)}</TableCell>
          
          <TableCell padding="normal">
            <FlexBox alignItems="center">
                {!onEdit && <Paragraph>{values.percentClient.toFixed(3)}%</Paragraph> }
                {onEdit && <TextField
                  fullWidth
                  name="percentClient"
                  value={values.percentClient}
                  onChange={handleChange}
                  disabled={!onEdit}
                  helperText={touched.percentClient && errors.percentClient}
                  error={Boolean(touched.percentClient && errors.percentClient)} />}
                {!onEdit && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                    handleOnEdit();
                }} />}
                {onEdit && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                    handleSave();
                }} />}
            </FlexBox>
          </TableCell>

          <TableCell padding="normal">
            <FlexBox alignItems="center">
                {!onEdit && <Paragraph>{values.percentOur.toFixed(3)}%</Paragraph> }
                {onEdit && <TextField
                  fullWidth
                  name="percentOur"
                  value={values.percentOur}
                  onChange={handleChange}
                  disabled={!onEdit}
                  helperText={touched.percentOur && errors.percentOur}
                  error={Boolean(touched.percentOur && errors.percentOur)} />}
                {!onEdit && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                    handleOnEdit();
                }} />}
                {onEdit && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                    handleSave();
                }} />}
            </FlexBox>
          </TableCell>
          
          <TableCell padding="normal">{(parseFloat(values.percentClient) - parseFloat(values.percentOur)).toFixed(3)}%</TableCell>

          <TableCell padding="normal">{commission.providerCode}</TableCell>

          <TableCell padding="normal">{commission.tokenCode}</TableCell>
          <TableCell padding="normal" align="left">
            <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseOpenMenu}>
                {/*<TableMoreMenuItem Icon={RemoveRedEye} title="View" handleClick={() => {*/}
                {/*    handleCloseOpenMenu();*/}
                {/*}} />*/}
                <TableMoreMenuItem Icon={DeleteOutline} title="Delete" handleClick={() => {
                    handleCloseOpenMenu();
                    handleDeleteCommission(commission.id);
                }} />
            </TableMoreMenu>
          </TableCell>
        </TableRow>;
};
export default CommissionsTableRow;