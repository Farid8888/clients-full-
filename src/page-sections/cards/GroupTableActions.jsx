import { styled, TextField, MenuItem } from "@mui/material";
// CUSTOM COMPONENTS
import { FlexBox } from "components/flexbox";
import { useTranslation } from "react-i18next";

//  STYLED COMPONENTS
const Wrapper = styled(FlexBox)(({
  theme
}) => ({
  alignItems: "center",
  ".select": {
    flex: "1 1 200px"
  },
  [theme.breakpoints.down(426)]: {
    flexWrap: "wrap"
  }
}));

// ==============================================================

// ==============================================================

const GroupTableActions = ({
  handleChangeFilter,
  filter
}) => {
  const GROUP_STATUS = [{
    id: 1,
    name: "All",
    value: ""
  }, {
    id: 2,
    name: "Active",
    value: 0
  }, {
    id: 3,
    name: "Pause",
    value: 1
  }];

  const { 
    t
  } = useTranslation();

  return <Wrapper gap={2} px={2} pb={3}>
      <TextField select fullWidth label={t("Status")} className="select" value={filter.status} onChange={e => handleChangeFilter("status", e.target.value)}>
        {GROUP_STATUS.map(({
        id,
        name,
        value
      }) => <MenuItem key={id} value={value}>
            {name}
          </MenuItem>)}
      </TextField>

      <TextField fullWidth value={filter.search} label={t("Search group by name...")} onChange={e => handleChangeFilter("search", e.target.value)} />
    </Wrapper>;
};
export default GroupTableActions;