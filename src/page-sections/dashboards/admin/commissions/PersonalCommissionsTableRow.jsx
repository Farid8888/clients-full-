import { useState } from "react";
import { TextField, Button, Checkbox, TableCell, TableRow} from "@mui/material";
import { Edit, Check } from "@mui/icons-material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { Paragraph } from "components/typography";
import { TableMoreMenuItem } from "components/table";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

function getEnumKeyByEnumValue(myEnum, enumValue) {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return keys.length > 0 ? keys[0] : null;
}

const PersonalCommissionsTableRow = props => {
  const {
    commission,
    isSelected,
    handleSelectRow,
    handleEditPersonalCommission,
    handleDeletePersonalCommission
  } = props;

  const [onEdit, setOnEdit] = useState(false);

  const handleOnEdit = () => setOnEdit(!onEdit);
  const handleSave = () => {
    handleSubmit();
  }
  
  const validationSchema = Yup.object({
    percent: Yup.number(),
  });
  const initialValues = {
    id: commission.id,
    percent: commission.percent,
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
        handleEditPersonalCommission(values);
        setOnEdit(!onEdit);
    }
  });
  
  const userType = {
    CLIENT: 0,
    TRADER: 1,
    SYSTEM: 2
    };

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

          <TableCell padding="normal">{getEnumKeyByEnumValue(userType, commission.userType)}</TableCell>

          <TableCell padding="normal">{commission.userName}</TableCell>
          
          <TableCell padding="normal">{getEnumKeyByEnumValue(offerType, commission.offerType)}</TableCell>
          
          <TableCell padding="normal">
            <FlexBox alignItems="center">
              {!onEdit && values.percent }
              {onEdit && <TextField
                fullWidth
                name="percent"
                value={values.percent}
                onChange={handleChange}
                disabled={!onEdit}
                helperText={touched.percent && errors.percent}
                error={Boolean(touched.percent && errors.percent)} />}
              {!onEdit && <TableMoreMenuItem Icon={Edit} title="" handleClick={() => {
                handleOnEdit();
              }} />}
              {onEdit && <TableMoreMenuItem Icon={Check} title="" handleClick={() => {
                handleSave();
              }} />}
            </FlexBox>
          </TableCell>
          
          <TableCell padding="normal">{commission.providerCode}</TableCell>

          <TableCell padding="normal">{commission.tokenCode}</TableCell>

          <TableCell padding="normal">
            <Button sx={{ minWidth: 100 }} onClick={() => { handleDeletePersonalCommission(commission.id); }}>{t("Delete")}</Button>
          </TableCell>
        </TableRow>;
};
export default PersonalCommissionsTableRow;