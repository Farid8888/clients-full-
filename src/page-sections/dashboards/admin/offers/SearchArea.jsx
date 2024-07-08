import { TextField } from "@mui/material";
import Search from "@mui/icons-material/Search";
// CUSTOM DEFINED HOOK
import { useTranslation } from "react-i18next";
// CUSTOM COMPONENTS
import { FlexBetween } from "components/flexbox";

// ==========================================================================================

// ==========================================================================================

const SearchArea = props => {
  const {
    value = "",
    onChange,
  } = props;

  const {
      t
  } = useTranslation();

  return <FlexBetween gap={1} my={3}>
      {/* SEARCH BOX */}
      <TextField value={value} onChange={onChange} placeholder={t("Search...")} InputProps={{
          startAdornment: <Search />
        }} sx={{
          maxWidth: 400,
          width: "100%"
        }} />
    </FlexBetween>;
};
export default SearchArea;